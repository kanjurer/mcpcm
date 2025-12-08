import { promises as fs, existsSync } from 'fs';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import { MCPConfig, MCPServer } from '../types/index.js';

export class ConfigParser {
  async read(configPath: string): Promise<MCPConfig> {
    try {
      const exists = existsSync(configPath);

      if (!exists) {
        return { mcpServers: {} };
      }

      const content = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(content);
      
      // Ensure the config has the expected structure
      if (!config.mcpServers) {
        config.mcpServers = {};
      }
      
      return config as MCPConfig;
    } catch (error) {
      throw new Error(`Failed to read config at ${configPath}: ${error}`);
    }
  }

  async write(configPath: string, config: MCPConfig): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(configPath);
      await fsExtra.ensureDir(dir);

      // Create backup if file exists
      if (existsSync(configPath)) {
        const backupPath = `${configPath}.backup`;
        await fsExtra.copy(configPath, backupPath, { overwrite: true });
      }

      // Write config with pretty formatting
      await fs.writeFile(
        configPath,
        JSON.stringify(config, null, 2),
        'utf-8'
      );
    } catch (error) {
      throw new Error(`Failed to write config to ${configPath}: ${error}`);
    }
  }

  async addServer(configPath: string, serverName: string, server: MCPServer): Promise<void> {
    const config = await this.read(configPath);
    
    if (config.mcpServers[serverName]) {
      throw new Error(`Server "${serverName}" already exists in config`);
    }
    
    config.mcpServers[serverName] = server;
    await this.write(configPath, config);
  }

  async removeServer(configPath: string, serverName: string): Promise<void> {
    const config = await this.read(configPath);
    
    if (!config.mcpServers[serverName]) {
      throw new Error(`Server "${serverName}" not found in config`);
    }
    
    delete config.mcpServers[serverName];
    await this.write(configPath, config);
  }

  async listServers(configPath: string): Promise<Record<string, MCPServer>> {
    const config = await this.read(configPath);
    return config.mcpServers;
  }

  async enableServer(configPath: string, serverName: string): Promise<void> {
    const config = await this.read(configPath);

    if (!config.mcpServers[serverName]) {
      throw new Error(`Server "${serverName}" not found in config`);
    }

    config.mcpServers[serverName].enabled = true;
    await this.write(configPath, config);
  }

  async disableServer(configPath: string, serverName: string): Promise<void> {
    const config = await this.read(configPath);

    if (!config.mcpServers[serverName]) {
      throw new Error(`Server "${serverName}" not found in config`);
    }

    config.mcpServers[serverName].enabled = false;
    await this.write(configPath, config);
  }

  async toggleServer(configPath: string, serverName: string): Promise<boolean> {
    const config = await this.read(configPath);

    if (!config.mcpServers[serverName]) {
      throw new Error(`Server "${serverName}" not found in config`);
    }

    const currentState = config.mcpServers[serverName].enabled ?? true;
    const newState = !currentState;
    config.mcpServers[serverName].enabled = newState;
    await this.write(configPath, config);

    return newState;
  }

  async getServerStatus(configPath: string, serverName: string): Promise<boolean> {
    const config = await this.read(configPath);

    if (!config.mcpServers[serverName]) {
      throw new Error(`Server "${serverName}" not found in config`);
    }

    return config.mcpServers[serverName].enabled ?? true;
  }

  validate(config: MCPConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.mcpServers || typeof config.mcpServers !== 'object') {
      errors.push('Config must have an "mcpServers" object');
      return { valid: false, errors };
    }

    for (const [name, server] of Object.entries(config.mcpServers)) {
      if (!server.command || typeof server.command !== 'string') {
        errors.push(`Server "${name}" must have a "command" string`);
      }

      if (server.args && !Array.isArray(server.args)) {
        errors.push(`Server "${name}" args must be an array`);
      }

      if (server.env && typeof server.env !== 'object') {
        errors.push(`Server "${name}" env must be an object`);
      }

      if (server.timeout && typeof server.timeout !== 'number') {
        errors.push(`Server "${name}" timeout must be a number`);
      }

      if (server.enabled !== undefined && typeof server.enabled !== 'boolean') {
        errors.push(`Server "${name}" enabled must be a boolean`);
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
