import * as os from 'os';
import { OSType } from '../types/index.js';

export class OSDetector {
  static detect(): OSType {
    const platform = os.platform();
    
    switch (platform) {
      case 'win32':
        return 'windows';
      case 'darwin':
        return 'macos';
      case 'linux':
        return 'linux';
      default:
        return 'linux'; // Default to linux for unknown platforms
    }
  }

  static getHomePath(): string {
    return os.homedir();
  }

  static getConfigBasePath(osType: OSType): string {
    const home = this.getHomePath();
    
    switch (osType) {
      case 'windows':
        return process.env.APPDATA || `${home}\\AppData\\Roaming`;
      case 'macos':
        return `${home}/Library/Application Support`;
      case 'linux':
        return `${home}/.config`;
    }
  }
}
