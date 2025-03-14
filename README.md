# Log Analyzer

A simple command-line tool for analyzing log files.

## Usage

```bash
# Analyze a log file
./bin/cli.js -f /path/to/logfile.log

# Specify log type
./bin/cli.js -f /path/to/access.log -t nginx

# Verbose output
./bin/cli.js -f /path/to/logfile.log -v
```

## Supported Log Types

- generic (default)
- nginx
- apache

## Development

```bash
npm start
```