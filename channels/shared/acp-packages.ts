/**
 * Input: Environment variables (ACP_AGENT, ACP_USE_LEGACY, ACP_AGENT_COMMAND, ACP_AGENT_ARGS)
 * Output: Resolved agent command and args for ACP agent spawning
 * Pos: Shared utility — used by both wechat and feishu ACP bridges
 * 一旦我被修改，请更新我的头部注释，以及所属文件夹的md。
 */

// ACP Claude package names — newest first, legacy as fallback
export const ACP_CLAUDE_PACKAGES = [
  '@agentclientprotocol/claude-agent-acp',  // v0.24.0+ (2026-03-26, agentclientprotocol org)
  '@zed-industries/claude-code-acp',         // legacy ≤v0.23.x (zed-industries org)
] as const

/** Agent presets shared across wechat/feishu ACP bridges */
export const AGENT_PRESETS: Record<string, { command: string; args: string[] }> = {
  claude:   { command: 'npx', args: [ACP_CLAUDE_PACKAGES[0]] },
  copilot:  { command: 'npx', args: ['@github/copilot', '--acp', '--yolo'] },
  gemini:   { command: 'npx', args: ['@google/gemini-cli', '--experimental-acp'] },
  qwen:     { command: 'npx', args: ['@qwen-code/qwen-code', '--acp', '--experimental-skills'] },
  codex:    { command: 'npx', args: ['@zed-industries/codex-acp'] },
  opencode: { command: 'npx', args: ['opencode-ai', 'acp'] },
}

/**
 * Resolve the Claude ACP agent args with backward compatibility.
 * Priority: ACP_AGENT_COMMAND env > ACP_USE_LEGACY env > new package > legacy fallback
 */
export function resolveClaudeAcpArgs(): { command: string; args: string[] } {
  const envCommand = process.env.ACP_AGENT_COMMAND
  const envArgs = process.env.ACP_AGENT_ARGS?.split(' ').filter(Boolean) ?? []

  if (envCommand) {
    return { command: envCommand, args: envArgs }
  }

  // Check for legacy override
  if (process.env.ACP_USE_LEGACY === '1') {
    console.error('acp: using legacy ACP package (@zed-industries/claude-code-acp) per ACP_USE_LEGACY=1')
    return { command: 'npx', args: ['@zed-industries/claude-code-acp'] }
  }

  // Default to newest
  return { command: 'npx', args: [ACP_CLAUDE_PACKAGES[0]] }
}

/**
 * Get the ACP install hint for error messages.
 */
export function getAcpInstallHint(): string {
  return [
    'Install an ACP agent:',
    `  1. npm install -g ${ACP_CLAUDE_PACKAGES[0]}  (recommended)`,
    `  2. npm install -g ${ACP_CLAUDE_PACKAGES[1]}  (legacy)`,
    'Or set ACP_AGENT_COMMAND to your preferred agent command.',
  ].join('\n')
}
