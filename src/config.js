const fs = require('fs');
const path = require('path');
const os = require('os');

class ConfigManager {
  constructor() {
    this.configPaths = [
      path.join(process.cwd(), '.log-analyzer.json'),
      path.join(os.homedir(), '.log-analyzer.json'),
      path.join(__dirname, '..', 'config', 'default.json')
    ];
    this.config = this.loadConfig();
  }

  loadConfig() {
    for (const configPath of this.configPaths) {
      if (fs.existsSync(configPath)) {
        try {
          const configData = fs.readFileSync(configPath, 'utf8');
          return JSON.parse(configData);
        } catch (error) {
          console.warn(`Warning: Failed to parse config file ${configPath}: ${error.message}`);
          continue;
        }
      }
    }
    
    return this.getDefaultConfig();
  }

  getDefaultConfig() {
    return {
      parsers: {
        nginx: {
          format: "combined",
          timeFormat: "DD/MMM/YYYY:HH:mm:ss ZZ"
        },
        apache: {
          format: "common",
          timeFormat: "DD/MMM/YYYY:HH:mm:ss ZZ"
        }
      },
      watcher: {
        pollInterval: 1000,
        ignoreInitial: true
      },
      output: {
        colors: true,
        showProgress: true,
        maxLines: 10000
      },
      filters: {
        minSeverity: "info",
        excludeIPs: [],
        includeStatusCodes: []
      }
    };
  }

  get(key) {
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  createUserConfig() {
    const userConfigPath = path.join(os.homedir(), '.log-analyzer.json');
    if (!fs.existsSync(userConfigPath)) {
      fs.writeFileSync(userConfigPath, JSON.stringify(this.getDefaultConfig(), null, 2));
      console.log(`Created config file: ${userConfigPath}`);
    }
  }
}

module.exports = ConfigManager;