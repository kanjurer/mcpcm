import { AgentDetector } from '../core/agent-detector.js';
import chalk from 'chalk';

export async function initCommand() {
  console.log(chalk.bold.cyan('\n🚀 MCPCM - MCP Configuration Manager\n'));
  
  const detector = new AgentDetector();
  const agents = await detector.detectAll();
  
  console.log(chalk.bold('Detected coding agents:\n'));
  
  let foundCount = 0;
  for (const agent of agents) {
    const status = agent.exists ? chalk.green('✓ Found') : chalk.gray('✗ Not found');
    console.log(status + ' ' + chalk.bold(agent.displayName));
    console.log(chalk.gray(`  Config: ` + agent.configPath + `\n`));
    
    if (agent.exists) foundCount++;
  }
  
  console.log(chalk.bold.white(`\nSummary: ` + foundCount + `/` + agents.length + ` agents detected`));
  console.log(chalk.gray('\nUse "mcpcm list" to see configured MCP servers'));
  console.log(chalk.gray('Use "mcpcm add <server-name>" to add a new server\n'));
}
