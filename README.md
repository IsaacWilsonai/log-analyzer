# Log Analyzer

A command-line tool for analyzing and monitoring log files with real-time capabilities.

## Features

- Support for multiple log formats (nginx, apache, generic)
- Real-time file monitoring
- Detailed statistics and reporting
- Error and warning detection

## Usage

```bash
# Analyze a log file
./bin/cli.js -f /path/to/logfile.log

# Specify log type for detailed parsing
./bin/cli.js -f /path/to/access.log -t nginx

# Real-time monitoring mode
./bin/cli.js -f /path/to/logfile.log -w

# Verbose output
./bin/cli.js -f /path/to/logfile.log -v

# Combined options
./bin/cli.js -f /path/to/access.log -t nginx -w -v
```

## Supported Log Types

- **generic** (default) - Basic error/warning detection
- **nginx** - Nginx access log format with status codes, IPs, methods
- **apache** - Apache access log format with bytes transferred tracking

## Real-time Monitoring

Use the `-w` flag to monitor log files in real-time. The tool will watch for file changes and display new entries as they're added.

## Installation

```bash
npm install -g log-analyzer
```

## Development

```bash
npm start
```