import * as fs from 'fs-extra';
import * as path from 'path';
import { AgentInfo, AgentType, OSType } from '../types/index.js';
import { OSDetector } from './os-detector.js';

export class AgentDetector {
  private osType: OSType;
  private homePath: string;

  constructor() {
    this.osType = OSDetector.detect();
    this.homePath = OSDetector.getHomePath();
  }

  async detectAll(): Promise<AgentInfo[]> {
    const agents: AgentType[] = ['claude-code', 'cursor', 'windsurf', 'vscode', 'jetbrains'];
    const results: AgentInfo[] = [];

    for (const agent of agents) {
      const configPath = this.getConfigPath(agent);
      const exists = await fs.pathExists(configPath);
      
      results.push({
        name: agent,
        displayName: this.getDisplayName(agent),
        configPath,
        exists
      });
    }

    return results;
  }

  getConfigPath(agent: AgentType): string {
    switch (agent) {
      case 'claude-code':
        return path.join(this.homePath, '.claude.json');
      
      case 'cursor':
        return path.join(this.homePath, '.cursor', 'mcp.json');
      
      case 'windsurf':
        return path.join(this.homePath, '.codeium', 'windsurf', 'mcp_config.json');
      
      case 'vscode':
        return path.join(this.homePath, '.vscode', 'mcp.json');
      
      case 'jetbrains':
        return path.join(this.homePath, '.junie', 'mcp', 'mcp.json');
      
      default:
        throw new Error(`Unknown agent: ${agent}`);
    }
  }

  private getDisplayName(agent: AgentType): string {
    const names: Record<AgentType, string> = {
      'claude-code': 'Claude Code',
      'cursor': 'Cursor',
      'windsurf': 'Windsurf',
      'vscode': 'VS Code',
      'jetbrains': 'JetBrains (Junie)'
    };
    return names[agent];
  }
}
