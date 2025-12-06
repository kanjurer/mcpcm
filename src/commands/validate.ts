import { AgentDetector } from '../core/agent-detector.js';
import { ConfigParser } from '../core/config-parser.js';
import chalk from 'chalk';

export async function validateCommand(options: { agent?: string }) {
  const detector = new AgentDetector();
  const parser = new ConfigParser();
  
  const agents = await detector.detectAll();
  const targetAgents = options.agent
    ? agents.filter(a => a.name === options.agent && a.exists)
    : agents.filter(a => a.exists);
  
  if (targetAgents.length === 0) {
    console.log(chalk.yellow('No configurations found to validate.'));
    return;
  }
  
  console.log(chalk.bold.cyan('\n🔍 Validating MCP configurations...\n'));
  
  let allValid = true;
  for (const agent of targetAgents) {
    console.log(chalk.bold(agent.displayName));
    
    try {
      const config = await parser.read(agent.configPath);
      const result = parser.validate(config);
      
      if (result.valid) {
        console.log(chalk.green('  ✓ Configuration is valid'));
      } else {
        console.log(chalk.red('  ✗ Configuration has errors:'));
        result.errors.forEach(error => {
          console.log(chalk.red(`    - ${error}`));
        });
        allValid = false;
      }
    } catch (error) {
      console.log(chalk.red(`  ✗ Error reading config: ${error}`));
      allValid = false;
    }
    
    console.log();
  }
  
  if (allValid) {
    console.log(chalk.bold.green('✓ All configurations are valid!\n'));
  } else {
    console.log(chalk.bold.red('✗ Some configurations have errors.\n'));
    process.exit(1);
  }
}
