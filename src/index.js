const fs = require('fs');
const path = require('path');
const NginxParser = require('./parsers/nginx');
const ApacheParser = require('./parsers/apache');

class LogAnalyzer {
  constructor(filePath, logType = 'generic') {
    this.filePath = filePath;
    this.logType = logType;
    this.lines = [];
    this.stats = {
      totalLines: 0,
      errors: 0,
      warnings: 0
    };
    
    this.initializeParser();
  }

  initializeParser() {
    switch (this.logType.toLowerCase()) {
      case 'nginx':
        this.parser = new NginxParser();
        break;
      case 'apache':
        this.parser = new ApacheParser();
        break;
      default:
        this.parser = null;
    }
  }

  async analyze() {
    try {
      if (!fs.existsSync(this.filePath)) {
        throw new Error(`Log file does not exist: ${this.filePath}`);
      }

      const stats = fs.statSync(this.filePath);
      if (!stats.isFile()) {
        throw new Error(`Path is not a file: ${this.filePath}`);
      }

      if (stats.size === 0) {
        console.log('Warning: Log file is empty');
        return this.generateReport();
      }

      const content = fs.readFileSync(this.filePath, 'utf8');
      this.lines = content.split('\n').filter(line => line.trim() !== '');
      this.stats.totalLines = this.lines.length;
      
      if (this.lines.length === 0) {
        console.log('Warning: No valid log entries found');
      }
      
      this.parseLines();
      return this.generateReport();
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Log file not found: ${this.filePath}`);
      } else if (error.code === 'EACCES') {
        throw new Error(`Permission denied: ${this.filePath}`);
      } else {
        throw new Error(`Failed to read log file: ${error.message}`);
      }
    }
  }

  parseLines() {
    this.lines.forEach(line => {
      if (line.toLowerCase().includes('error')) {
        this.stats.errors++;
      } else if (line.toLowerCase().includes('warn')) {
        this.stats.warnings++;
      }

      if (this.parser) {
        this.parser.parseLine(line);
      }
    });
  }

  generateReport() {
    const report = {
      file: this.filePath,
      type: this.logType,
      stats: this.stats,
      summary: `Analyzed ${this.stats.totalLines} lines, found ${this.stats.errors} errors and ${this.stats.warnings} warnings`
    };

    if (this.parser) {
      report.detailedStats = this.parser.getStats();
    }

    return report;
  }
}

module.exports = LogAnalyzer;