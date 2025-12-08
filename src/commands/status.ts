import { AgentDetector } from '../core/agent-detector.js';
import { ConfigParser } from '../core/config-parser.js';
import chalk from 'chalk';

export async function statusCommand(options: { agent?: string }) {
  const detector = new AgentDetector();
  const parser = new ConfigParser();

  const agents = await detector.detectAll();
  const targetAgents = options.agent
    ? agents.filter(a => a.name === options.agent && a.exists)
    : agents.filter(a => a.exists);

  if (targetAgents.length === 0) {
    console.log(chalk.yellow('No MCP configurations found.'));
    return;
  }

  console.log(chalk.bold.cyan('\n📊 MCP Server Status\n'));

  for (const agent of targetAgents) {
    try {
      const servers = await parser.listServers(agent.configPath);
      const serverNames = Object.keys(servers);

      if (serverNames.length === 0) {
        console.log(chalk.bold(agent.displayName));
        console.log(chalk.yellow('  No servers configured\n'));
        continue;
      }

      let enabledCount = 0;
      let disabledCount = 0;

      serverNames.forEach(name => {
        const server = servers[name];
        const isEnabled = server.enabled ?? true;
        if (isEnabled) {
          enabledCount++;
        } else {
          disabledCount++;
        }
      });

      console.log(chalk.bold(agent.displayName) + chalk.gray(' - ') + 
                  chalk.green(enabledCount + ' enabled') + chalk.gray(', ') + 
                  chalk.red(disabledCount + ' disabled'));

      serverNames.forEach(name => {
        const server = servers[name];
        const isEnabled = server.enabled ?? true;
        const icon = isEnabled ? chalk.green('✓') : chalk.red('✗');
        const status = isEnabled ? chalk.gray('(enabled)') : chalk.gray('(disabled)');
        console.log(`  ` + icon + ` ` + chalk.white(name) + ` ` + status);
      });

      console.log();
    } catch (error) {
      console.log(chalk.bold(agent.displayName));
      console.log(chalk.red(`  Error: ` + error + `\n`));
    }
  }
}
