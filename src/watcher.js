const fs = require('fs');
const chokidar = require('chokidar');
const LogAnalyzer = require('./index');

class LogWatcher {
  constructor(filePath, logType = 'generic', options = {}) {
    this.filePath = filePath;
    this.logType = logType;
    this.options = {
      interval: options.interval || 1000,
      verbose: options.verbose || false
    };
    this.lastPosition = 0;
    this.analyzer = new LogAnalyzer(filePath, logType);
  }

  start() {
    if (!fs.existsSync(this.filePath)) {
      console.error(`File not found: ${this.filePath}`);
      return;
    }

    this.lastPosition = fs.statSync(this.filePath).size;
    
    console.log(`Watching ${this.filePath} for changes...`);
    console.log('Press Ctrl+C to stop\n');

    const watcher = chokidar.watch(this.filePath, {
      ignoreInitial: true,
      persistent: true
    });

    watcher.on('change', () => {
      this.processNewContent();
    });

    process.on('SIGINT', () => {
      console.log('\nStopping log watcher...');
      watcher.close();
      process.exit(0);
    });
  }

  processNewContent() {
    try {
      const stats = fs.statSync(this.filePath);
      const currentSize = stats.size;

      if (currentSize > this.lastPosition) {
        const stream = fs.createReadStream(this.filePath, {
          start: this.lastPosition,
          end: currentSize
        });

        let buffer = '';
        
        stream.on('data', (chunk) => {
          buffer += chunk.toString();
        });

        stream.on('end', () => {
          const lines = buffer.split('\n').filter(line => line.trim() !== '');
          
          if (lines.length > 0) {
            this.analyzeNewLines(lines);
          }
          
          this.lastPosition = currentSize;
        });

      } else if (currentSize < this.lastPosition) {
        console.log('File truncated, resetting position...');
        this.lastPosition = 0;
      }
    } catch (error) {
      console.error('Error processing file change:', error.message);
    }
  }

  analyzeNewLines(lines) {
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] New entries detected: ${lines.length}`);
    
    lines.forEach(line => {
      if (this.options.verbose) {
        console.log(`  ${line}`);
      }
      
      if (line.toLowerCase().includes('error')) {
        console.log(`  🔴 ERROR: ${line}`);
      } else if (line.toLowerCase().includes('warn')) {
        console.log(`  🟡 WARNING: ${line}`);
      }
    });

    console.log('---');
  }
}

module.exports = LogWatcher;