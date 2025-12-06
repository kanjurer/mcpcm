import { AgentDetector } from '../core/agent-detector.js';
import { ConfigParser } from '../core/config-parser.js';
import { MCPServer } from '../types/index.js';
import chalk from 'chalk';
import inquirer from 'inquirer';

export async function addCommand(serverName: string, options: { agent?: string }) {
  const detector = new AgentDetector();
  const parser = new ConfigParser();
  
  // Get server details interactively
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'command',
      message: 'Server command:',
      default: 'npx',
      validate: (input: string) => input.trim().length > 0 || 'Command is required'
    },
    {
      type: 'input',
      name: 'args',
      message: 'Command arguments (space-separated):',
      default: `-y @modelcontextprotocol/server-${serverName}`
    },
    {
      type: 'input',
      name: 'env',
      message: 'Environment variables (format: KEY=value KEY2=value2):',
      default: ''
    }
  ]);
  
  // Parse server configuration
  const server: MCPServer = {
    command: answers.command.trim(),
    args: answers.args.trim() ? answers.args.trim().split(/\s+/) : [],
  };
  
  if (answers.env.trim()) {
    server.env = {};
    answers.env.trim().split(/\s+/).forEach((pair: string) => {
      const [key, value] = pair.split('=');
      if (key && value) {
        server.env![key] = value;
      }
    });
  }
  
  // Get target agents
  const agents = await detector.detectAll();
  const targetAgents = options.agent
    ? agents.filter(a => a.name === options.agent)
    : agents.filter(a => a.exists);
  
  if (targetAgents.length === 0) {
    console.log(chalk.red('No target agents found.'));
    return;
  }
  
  // Add to each agent
  console.log(chalk.cyan(`\nAdding server "${serverName}"...\n`));
  
  for (const agent of targetAgents) {
    try {
      await parser.addServer(agent.configPath, serverName, server);
      console.log(chalk.green(`✓ Added to ${agent.displayName}`));
    } catch (error) {
      console.log(chalk.red(`✗ Failed to add to ${agent.displayName}: ${error}`));
    }
  }
  
  console.log(chalk.bold.green(`\n✓ Server "${serverName}" added successfully!\n`));
}
