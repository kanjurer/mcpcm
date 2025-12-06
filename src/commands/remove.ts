import { AgentDetector } from '../core/agent-detector.js';
import { ConfigParser } from '../core/config-parser.js';
import chalk from 'chalk';

export async function removeCommand(serverName: string, options: { agent?: string }) {
  const detector = new AgentDetector();
  const parser = new ConfigParser();
  
  const agents = await detector.detectAll();
  const targetAgents = options.agent
    ? agents.filter(a => a.name === options.agent && a.exists)
    : agents.filter(a => a.exists);
  
  if (targetAgents.length === 0) {
    console.log(chalk.red('No target agents found.'));
    return;
  }
  
  console.log(chalk.cyan(`\nRemoving server "${serverName}"...\n`));
  
  let removed = 0;
  for (const agent of targetAgents) {
    try {
      await parser.removeServer(agent.configPath, serverName);
      console.log(chalk.green(`✓ Removed from ${agent.displayName}`));
      removed++;
    } catch (error) {
      console.log(chalk.yellow(`⚠ Not found in ${agent.displayName}`));
    }
  }
  
  if (removed > 0) {
    console.log(chalk.bold.green(`\n✓ Server "${serverName}" removed from ${removed} agent(s)!\n`));
  } else {
    console.log(chalk.yellow(`\nServer "${serverName}" not found in any configurations.\n`));
  }
}
