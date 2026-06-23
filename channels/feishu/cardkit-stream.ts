/**
 * Input: Feishu Lark.Client + chat_id + incremental markdown text from an ACP/agent response
 * Output: a live "typewriter" streaming card in the Feishu chat (cardkit/v1 entity + incremental content pushes)
 * Pos: Feishu streaming UX helper — used by acp-bridge.ts (真流式) and optionally server.ts (伪流式)
 * 一旦我被修改，请更新我的头部注释，以及所属文件夹的md。
 *
 * Wraps Feishu cardkit/v1 API (@larksuiteoapi/node-sdk >= 1.67.0):
 *   - card.create   POST /cardkit/v1/cards            -> card_id (streaming_mode card)
 *   - cardElement.content PUT /cardkit/v1/cards/:card_id/elements/:element_id/content (incremental markdown)
 *   - card.settings PATCH /cardkit/v1/cards/:card_id/settings (toggle streaming_mode off on finish)
 *   - im.v1.message.create with msg_type=interactive, content={type:'card', data:{card_id}}
 *
 * Card entities live 14 days. All updates carry a monotonic `sequence` (required by the API).
 */

import type * as Lark from '@larksuiteoapi/node-sdk'

// The markdown element we stream into. Fixed id so we always know which element to PUT.
const STREAM_ELEMENT_ID = 'streaming_md'

export type CardkitStreamOptions = {
  /** print_frequency_ms: client-side typing interval (lower = faster). Default 70. */
  printFrequencyMs?: number
  /** print_step: chars revealed per tick. Default 1. */
  printStep?: number
  /** print_strategy: 'fast' | 'delay'. Default 'fast'. */
  printStrategy?: 'fast' | 'delay'
  /** Header title shown on the card. */
  title?: string
  /** Optional logger for diagnostics. */
  log?: (msg: string) => void
}

/**
 * Build the initial card JSON for a streaming card.
 * cardkit cards use schema 2.0. streaming_mode + streaming_config live under config.
 */
function buildInitialCard(opts: CardkitStreamOptions): unknown {
  const card: Record<string, unknown> = {
    schema: '2.0',
    config: {
      streaming_mode: true,
      streaming_config: {
        print_frequency_ms: opts.printFrequencyMs ?? 70,
        print_step: opts.printStep ?? 1,
        print_strategy: opts.printStrategy ?? 'fast',
      },
    },
    body: {
      elements: [
        {
          tag: 'markdown',
          element_id: STREAM_ELEMENT_ID,
          content: '',
        },
      ],
    },
  }
  if (opts.title) {
    card.header = {
      title: { tag: 'plain_text', content: opts.title },
    }
  }
  return card
}

/**
 * CardkitStreamController encapsulates the lifecycle of one streaming card:
 *   ensureStarted() -> create card entity + send it as a chat message (idempotent, lazy)
 *   push(text)      -> append text and flush an incremental content update (throttled)
 *   finish(text?)   -> push final content, then close streaming_mode
 *   fallbackText()  -> the full accumulated text (for graceful degradation)
 *
 * Any cardkit API failure flips `failed` so callers can fall back to plain messages.
 */
export class CardkitStreamController {
  private client: Lark.Client
  private chatId: string
  private opts: CardkitStreamOptions
  private cardId: string | null = null
  private accumulated = ''
  private lastPushed = ''
  private sequence = 1
  private starting: Promise<boolean> | null = null
  private flushTimer: ReturnType<typeof setTimeout> | null = null
  // A single promise chain that all flushes are serialized onto. Initialized to a
  // resolved promise so the first flush links cleanly. Never null — every flushNow()
  // appends a .then(doFlush) so timer-driven and finish()-driven flushes run in order.
  private flushing: Promise<void> = Promise.resolve()
  private pending = false
  private readonly throttleMs: number
  /** true once any cardkit call fails — caller should fall back. */
  failed = false
  /** true once the card has been successfully created and sent. */
  started = false

  constructor(client: Lark.Client, chatId: string, opts: CardkitStreamOptions = {}) {
    this.client = client
    this.chatId = chatId
    this.opts = opts
    // Throttle network pushes to ~the client print frequency to avoid rate limits (5 QPS).
    this.throttleMs = Math.max(200, (opts.printFrequencyMs ?? 70) * 2)
  }

  private log(msg: string) {
    this.opts.log?.(msg)
  }

  /**
   * Lazily create the card entity and send it to the chat. Idempotent and
   * concurrency-safe: parallel callers share the same in-flight promise.
   * Returns true on success, false if cardkit is unavailable (caller falls back).
   */
  async ensureStarted(): Promise<boolean> {
    if (this.started) return true
    if (this.failed) return false
    if (this.starting) return this.starting
    this.starting = this.doStart()
    return this.starting
  }

  private async doStart(): Promise<boolean> {
    try {
      const cardJson = buildInitialCard(this.opts)
      const createRes = await this.client.cardkit.v1.card.create({
        data: {
          type: 'card_json',
          data: JSON.stringify(cardJson),
        },
      })
      const cardId = createRes?.data?.card_id
      if (!cardId) throw new Error('cardkit create returned no card_id')
      this.cardId = cardId

      // Send the cardkit entity as a chat message.
      await this.client.im.v1.message.create({
        params: { receive_id_type: 'chat_id' },
        data: {
          receive_id: this.chatId,
          msg_type: 'interactive',
          content: JSON.stringify({ type: 'card', data: { card_id: cardId } }),
        },
      })

      this.started = true
      this.log(`cardkit stream started card_id=${cardId}`)
      return true
    } catch (err) {
      this.failed = true
      this.log(`cardkit start failed, falling back: ${err instanceof Error ? err.message : String(err)}`)
      return false
    }
  }

  /**
   * Append text to the stream. Schedules a throttled incremental push.
   * Safe to call rapidly from per-chunk ACP events.
   */
  push(text: string): void {
    if (!text) return
    this.accumulated += text
    if (this.failed) return
    this.scheduleFlush()
  }

  private scheduleFlush(): void {
    this.pending = true
    if (this.flushTimer) return
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null
      void this.flushNow()
    }, this.throttleMs)
  }

  /** Force an immediate incremental push (used internally + at finish). */
  private async flushNow(): Promise<void> {
    // Chain every flush onto a single promise so doFlush() runs strictly serially.
    // Both the throttle timer and finish() append here; sequence increments and API
    // calls (content PUT, settings PATCH) therefore never interleave or reorder.
    this.flushing = this.flushing.then(() => this.doFlush()).catch((err) => {
      // Keep the chain alive even if one flush throws unexpectedly.
      this.log(`cardkit flush error: ${err instanceof Error ? err.message : String(err)}`)
    })
    return this.flushing
  }

  private async doFlush(): Promise<void> {
    if (this.failed) return
    if (!this.started) {
      const ok = await this.ensureStarted()
      if (!ok) return
    }
    if (!this.cardId) return
    if (this.accumulated === this.lastPushed) { this.pending = false; return }
    const content = this.accumulated
    this.pending = false
    try {
      await this.client.cardkit.v1.cardElement.content({
        path: { card_id: this.cardId, element_id: STREAM_ELEMENT_ID },
        data: { content, sequence: this.sequence++ },
      })
      this.lastPushed = content
    } catch (err) {
      this.failed = true
      this.log(`cardkit content push failed, falling back: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  /**
   * Finalize the stream: push final text (if any) and close streaming_mode so the
   * client stops showing the typing cursor. Best-effort; never throws.
   */
  async finish(finalText?: string): Promise<void> {
    if (this.flushTimer) { clearTimeout(this.flushTimer); this.flushTimer = null }
    if (typeof finalText === 'string') this.accumulated = finalText
    if (this.failed) return
    if (!this.started) return
    // Push any remaining buffered content.
    await this.flushNow()
    if (this.failed || !this.cardId) return
    try {
      const settings = { config: { streaming_mode: false } }
      await this.client.cardkit.v1.card.settings({
        path: { card_id: this.cardId },
        data: { settings: JSON.stringify(settings), sequence: this.sequence++ },
      })
      this.log('cardkit stream finished (streaming_mode off)')
    } catch (err) {
      // Non-fatal: the content is already shown; only the cursor toggle failed.
      this.log(`cardkit finish (settings) failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  /** Full accumulated text — used by callers to fall back to plain messages. */
  fallbackText(): string {
    return this.accumulated
  }

  /** Whether any cardkit content was successfully delivered to the client. */
  hasDelivered(): boolean {
    return this.started && this.lastPushed.length > 0 && !this.failed
  }
}

/** Whether streaming cards are enabled via env. Default ON (set FEISHU_STREAMING=0 to disable). */
export function streamingEnabled(): boolean {
  const v = process.env.FEISHU_STREAMING
  if (v == null || v === '') return true
  return v !== '0' && v.toLowerCase() !== 'false' && v.toLowerCase() !== 'off'
}

/**
 * Whether pseudo-streaming is enabled for MCP Channel mode (server.ts). Default OFF.
 * Channel-mode replies are produced whole, so feeding them through cardkit only adds
 * extra API calls (card.create + N×content PUT + settings PATCH) under Feishu's 5 QPS
 * limit. Opt in explicitly with FEISHU_CHANNEL_PSEUDO_STREAM=1. ACP real streaming
 * (FEISHU_STREAMING) is unaffected — it has a genuine incremental source.
 */
export function pseudoStreamEnabled(): boolean {
  const v = process.env.FEISHU_CHANNEL_PSEUDO_STREAM
  if (v == null || v === '') return false
  return v === '1' || v.toLowerCase() === 'true' || v.toLowerCase() === 'on'
}

export function streamOptionsFromEnv(overrides: CardkitStreamOptions = {}): CardkitStreamOptions {
  const freq = parseInt(process.env.FEISHU_STREAMING_FREQ_MS ?? '', 10)
  const step = parseInt(process.env.FEISHU_STREAMING_STEP ?? '', 10)
  const strategy = process.env.FEISHU_STREAMING_STRATEGY
  return {
    printFrequencyMs: Number.isFinite(freq) && freq > 0 ? freq : undefined,
    printStep: Number.isFinite(step) && step > 0 ? step : undefined,
    printStrategy: strategy === 'delay' ? 'delay' : strategy === 'fast' ? 'fast' : undefined,
    ...overrides,
  }
}
