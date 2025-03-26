#!/usr/bin/env node

const { program } = require('commander');
const LogAnalyzer = require('../src/index');
const LogWatcher = require('../src/watcher');
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description('Log analyzer tool for parsing and analyzing log files')
  .option('-f, --file <path>', 'path to log file')
  .option('-t, --type <type>', 'log type (nginx, apache, generic)', 'generic')
  .option('-w, --watch', 'watch file for real-time monitoring')
  .option('-v, --verbose', 'verbose output')
  .parse();

const options = program.opts();

if (!options.file) {
  console.error('Error: Please specify a log file with -f option');
  process.exit(1);
}

async function main() {
  try {
    if (options.watch) {
      const watcher = new LogWatcher(options.file, options.type, {
        verbose: options.verbose
      });
      watcher.start();
      return;
    }
    
    if (options.verbose) {
      console.log(`Analyzing log file: ${options.file}`);
      console.log(`Log type: ${options.type}`);
    }
    
    const analyzer = new LogAnalyzer(options.file, options.type);
    const report = await analyzer.analyze();
    
    console.log('\n=== Log Analysis Report ===');
    console.log(`File: ${report.file}`);
    console.log(`Type: ${report.type}`);
    console.log(`Total lines: ${report.stats.totalLines}`);
    console.log(`Errors found: ${report.stats.errors}`);
    console.log(`Warnings found: ${report.stats.warnings}`);
    
    if (report.detailedStats) {
      console.log('\n=== Detailed Statistics ===');
      
      if (report.detailedStats.statusCodes) {
        console.log('Status Codes:', JSON.stringify(report.detailedStats.statusCodes, null, 2));
      }
      
      if (report.detailedStats.methods) {
        console.log('HTTP Methods:', JSON.stringify(report.detailedStats.methods, null, 2));
      }
      
      if (report.detailedStats.topIps) {
        console.log('Top IPs:', report.detailedStats.topIps);
      }
      
      if (report.detailedStats.bytesTransferred) {
        console.log(`Bytes Transferred: ${report.detailedStats.bytesTransferred}`);
      }
    }
    
    console.log(`\nSummary: ${report.summary}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();