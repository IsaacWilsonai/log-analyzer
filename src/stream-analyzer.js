const fs = require('fs');
const readline = require('readline');
const { Transform } = require('stream');

class StreamLogAnalyzer {
  constructor(filePath, logType = 'generic', filter = null, options = {}) {
    this.filePath = filePath;
    this.logType = logType;
    this.filter = filter;
    this.options = {
      chunkSize: options.chunkSize || 1024 * 1024,
      maxMemory: options.maxMemory || 100 * 1024 * 1024
    };
    
    this.stats = {
      totalLines: 0,
      processedLines: 0,
      errors: 0,
      warnings: 0
    };
  }

  async analyzeStream(onProgress = null) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.filePath)) {
        reject(new Error(`File not found: ${this.filePath}`));
        return;
      }

      const fileStream = fs.createReadStream(this.filePath, { 
        encoding: 'utf8',
        highWaterMark: this.options.chunkSize 
      });

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      let lineCount = 0;
      const batchSize = 1000;
      let batch = [];

      rl.on('line', (line) => {
        if (line.trim() === '') return;
        
        this.stats.totalLines++;
        lineCount++;

        if (this.filter && !this.filter.shouldIncludeLine(line)) {
          return;
        }

        batch.push(line);
        this.stats.processedLines++;

        if (line.toLowerCase().includes('error')) {
          this.stats.errors++;
        } else if (line.toLowerCase().includes('warn')) {
          this.stats.warnings++;
        }

        if (batch.length >= batchSize) {
          if (onProgress) {
            onProgress({
              totalLines: this.stats.totalLines,
              processedLines: this.stats.processedLines,
              progress: (this.stats.totalLines / this.estimateLines()) * 100
            });
          }
          batch = [];
        }
      });

      rl.on('close', () => {
        resolve({
          file: this.filePath,
          type: this.logType,
          stats: this.stats,
          summary: `Processed ${this.stats.totalLines} lines, found ${this.stats.errors} errors and ${this.stats.warnings} warnings`
        });
      });

      rl.on('error', (error) => {
        reject(error);
      });

      fileStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  estimateLines() {
    try {
      const stats = fs.statSync(this.filePath);
      const avgLineLength = 100;
      return Math.ceil(stats.size / avgLineLength);
    } catch (error) {
      return 1000;
    }
  }

  static shouldUseStream(filePath, threshold = 50 * 1024 * 1024) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size > threshold;
    } catch (error) {
      return false;
    }
  }
}

module.exports = StreamLogAnalyzer;