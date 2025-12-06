import { AgentDetector } from '../core/agent-detector.js';
import { ConfigParser } from '../core/config-parser.js';
import chalk from 'chalk';

export async function listCommand(options: { agent?: string }) {
  const detector = new AgentDetector();
  const parser = new ConfigParser();
  
  const agents = await detector.detectAll();
  const targetAgents = options.agent
    ? agents.filter(a => a.name === options.agent)
    : agents.filter(a => a.exists);
  
  if (targetAgents.length === 0) {
    console.log(chalk.yellow('No MCP configurations found.'));
    return;
  }
  
  for (const agent of targetAgents) {
    console.log(chalk.bold.blue(`\n` + agent.displayName));
    console.log(chalk.gray(`Config: ` + agent.configPath));
    
    if (!agent.exists) {
      console.log(chalk.yellow('  No configuration file found'));
      continue;
    }
    
    try {
      const servers = await parser.listServers(agent.configPath);
      const serverNames = Object.keys(servers);
      
      if (serverNames.length === 0) {
        console.log(chalk.yellow('  No MCP servers configured'));
      } else {
        console.log(chalk.green(`  ` + serverNames.length + ` server(s) configured:`));
        serverNames.forEach(name => {
          const server = servers[name];
          console.log(chalk.white(`    - ` + name));
          console.log(chalk.gray(`      command: ` + server.command));
          if (server.args && server.args.length > 0) {
            console.log(chalk.gray(`      args: ` + server.args.join(' ')));
          }
        });
      }
    } catch (error) {
      console.log(chalk.red(`  Error reading config: ` + error));
    }
  }
}
