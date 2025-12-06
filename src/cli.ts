#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { addCommand } from './commands/add.js';
import { removeCommand } from './commands/remove.js';
import { validateCommand } from './commands/validate.js';

const program = new Command();

program
  .name('mcpcm')
  .description('MCP Configuration Manager - Manage MCP servers across coding agents')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize and detect installed coding agents')
  .action(initCommand);

program
  .command('list')
  .description('List all configured MCP servers')
  .option('-a, --agent <agent>', 'Target specific agent (claude-code, cursor, windsurf, vscode, jetbrains)')
  .action(listCommand);

program
  .command('add <server-name>')
  .description('Add a new MCP server')
  .option('-a, --agent <agent>', 'Target specific agent')
  .action(addCommand);

program
  .command('remove <server-name>')
  .description('Remove an MCP server')
  .option('-a, --agent <agent>', 'Target specific agent')
  .action(removeCommand);

program
  .command('validate')
  .description('Validate all MCP configurations')
  .option('-a, --agent <agent>', 'Target specific agent')
  .action(validateCommand);

program.parse();
