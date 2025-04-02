#!/usr/bin/env node

const { program } = require('commander');
const LogAnalyzer = require('../src/index');
const LogWatcher = require('../src/watcher');
const LogFilter = require('../src/filters');
const JSONFormatter = require('../src/formatters/json');
const CSVFormatter = require('../src/formatters/csv');
const TableFormatter = require('../src/formatters/table');
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description('Log analyzer tool for parsing and analyzing log files')
  .option('-f, --file <path>', 'path to log file')
  .option('-t, --type <type>', 'log type (nginx, apache, syslog, iis, json, generic)', 'generic')
  .option('-o, --output <format>', 'output format (table, json, csv)', 'table')
  .option('-w, --watch', 'watch file for real-time monitoring')
  .option('-v, --verbose', 'verbose output')
  .option('--after <date>', 'filter logs after this date (YYYY-MM-DD)')
  .option('--before <date>', 'filter logs before this date (YYYY-MM-DD)')
  .option('--include <pattern>', 'include lines matching pattern (regex)')
  .option('--exclude <pattern>', 'exclude lines matching pattern (regex)')
  .option('--severity <level>', 'minimum severity level (debug, info, warn, error)')
  .option('--status <codes>', 'filter by HTTP status codes (comma-separated)')
  .option('--ip <addresses>', 'filter by IP addresses (comma-separated)')
  .option('--exclude-ip <addresses>', 'exclude IP addresses (comma-separated)')
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
    
    const filter = LogFilter.fromOptions(options);
    const analyzer = new LogAnalyzer(options.file, options.type, filter);
    const report = await analyzer.analyze();
    
    let output;
    switch (options.output.toLowerCase()) {
      case 'json':
        output = JSONFormatter.format(report);
        break;
      case 'csv':
        output = CSVFormatter.format(report);
        break;
      case 'table':
      default:
        output = TableFormatter.format(report);
        break;
    }
    
    console.log(output);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();