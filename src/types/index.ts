export interface MCPServer {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  timeout?: number;
}

export interface MCPConfig {
  mcpServers: Record<string, MCPServer>;
}

export type AgentType = 'claude-code' | 'cursor' | 'windsurf' | 'vscode' | 'jetbrains';

export type OSType = 'windows' | 'macos' | 'linux';

export interface AgentInfo {
  name: AgentType;
  displayName: string;
  configPath: string;
  exists: boolean;
}

export interface ConfigLocation {
  agent: AgentType;
  path: string;
  type: 'global' | 'project';
}
