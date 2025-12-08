import { AgentDetector } from '../core/agent-detector.js';
import { ConfigParser } from '../core/config-parser.js';
import chalk from 'chalk';

export async function toggleCommand(serverName: string, options: { agent?: string }) {
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

  console.log(chalk.cyan(`\nToggling server "` + serverName + `"...\n`));

  let toggled = 0;
  for (const agent of targetAgents) {
    try {
      const newState = await parser.toggleServer(agent.configPath, serverName);
      const stateText = newState ? 'enabled' : 'disabled';
      console.log(chalk.green(`✓ Toggled to ` + stateText + ` in ` + agent.displayName));
      toggled++;
    } catch (error) {
      console.log(chalk.red(`✗ Failed in ` + agent.displayName + `: ` + error));
    }
  }

  if (toggled > 0) {
    console.log(chalk.bold.green(`\n✓ Server "` + serverName + `" toggled in ` + toggled + ` agent(s)!\n`));
  } else {
    console.log(chalk.yellow(`\nServer "` + serverName + `" not toggled in any agents.\n`));
  }
}
