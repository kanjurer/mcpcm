import { AgentDetector } from '../core/agent-detector.js';
import { ConfigParser } from '../core/config-parser.js';
import chalk from 'chalk';

export async function enableCommand(serverName: string, options: { agent?: string }) {
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

  console.log(chalk.cyan(`\nEnabling server "` + serverName + `"...\n`));

  let enabled = 0;
  for (const agent of targetAgents) {
    try {
      await parser.enableServer(agent.configPath, serverName);
      console.log(chalk.green(`✓ Enabled in ` + agent.displayName));
      enabled++;
    } catch (error) {
      console.log(chalk.red(`✗ Failed in ` + agent.displayName + `: ` + error));
    }
  }

  if (enabled > 0) {
    console.log(chalk.bold.green(`\n✓ Server "` + serverName + `" enabled in ` + enabled + ` agent(s)!\n`));
  } else {
    console.log(chalk.yellow(`\nServer "` + serverName + `" not enabled in any agents.\n`));
  }
}
