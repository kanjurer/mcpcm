# MCPCM - Model Context Protocol Configuration Manager

A cross-platform command-line tool to manage Model Context Protocol (MCP) servers across different coding agents and operating systems.

## Problem Statement

MCP configuration currently faces several challenges:

- **Lack of cross-platform documentation**: Limited Windows-specific guidance
- **Agent-specific configuration complexity**: Each coding agent (Claude Code, Cursor, Coda) has different config formats and locations
- **Windows terminal popup issues**: Multiple blank terminal windows appearing on editor launch
- **Documentation version mismatches**: Outdated configuration examples and deprecated flags

## Goals

MCPCM aims to solve these problems by providing:

- Unified MCP server management across all platforms (Windows, macOS, Linux)
- Support for multiple coding agents (Claude Code, Cursor, Coda, and more)
- Automatic detection and fixing of common configuration issues
- Simple, intuitive CLI for managing MCP servers
- Configuration validation and backup functionality

## Features (Planned)

- **Multi-Agent Support**: Configure MCP servers for Claude Code, Cursor, Coda, and other agents
- **Cross-Platform**: Full support for Windows, macOS, and Linux
- **Auto-Detection**: Automatically find and configure installed coding agents
- **Server Management**: Add, remove, list, and update MCP servers
- **Issue Resolution**: Fix common problems like Windows terminal popups
- **Configuration Validation**: Ensure configs match current schemas
- **Backup & Restore**: Safely backup configurations before changes

## Installation

```bash
# Coming soon
npm install -g mcpcm
```

## Usage

```bash
# Initialize and detect installed agents
mcpcm init

# List all configured MCP servers
mcpcm list

# Add an MCP server
mcpcm add <server-name>

# Remove an MCP server
mcpcm remove <server-name>

# Fix Windows terminal popup issues
mcpcm fix-windows-popups

# Validate all configurations
mcpcm validate

# Diagnose configuration issues
mcpcm doctor
```

## Development Status

This project is in early development. Contributions and feedback are welcome!

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT
