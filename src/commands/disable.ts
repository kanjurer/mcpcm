import { AgentDetector } from '../core/agent-detector.js';
import { ConfigParser } from '../core/config-parser.js';
import chalk from 'chalk';

export async function disableCommand(serverName: string, options: { agent?: string }) {
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

  console.log(chalk.cyan(`\nDisabling server "` + serverName + `"...\n`));

  let disabled = 0;
  for (const agent of targetAgents) {
    try {
      await parser.disableServer(agent.configPath, serverName);
      console.log(chalk.green(`✓ Disabled in ` + agent.displayName));
      disabled++;
    } catch (error) {
      console.log(chalk.red(`✗ Failed in ` + agent.displayName + `: ` + error));
    }
  }

  if (disabled > 0) {
    console.log(chalk.bold.green(`\n✓ Server "` + serverName + `" disabled in ` + disabled + ` agent(s)!\n`));
  } else {
    console.log(chalk.yellow(`\nServer "` + serverName + `" not disabled in any agents.\n`));
  }
}
