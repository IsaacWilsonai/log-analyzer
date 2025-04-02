# Log Analyzer

A powerful command-line tool for analyzing and monitoring log files with advanced filtering, multiple output formats, and real-time capabilities.

## Features

- 🔍 **Multiple Log Format Support** - nginx, apache, syslog, IIS, JSON logs, and generic text logs  
- 📊 **Multiple Output Formats** - table (default), JSON, CSV
- 🔄 **Real-time Monitoring** - Watch files for live updates
- ⚡ **Performance Optimized** - Stream processing for large files (>50MB)
- 🎯 **Advanced Filtering** - Filter by date, patterns, severity, status codes, IP addresses
- ⚙️ **Configuration Support** - Customizable via config files
- 📈 **Detailed Analytics** - Comprehensive statistics and insights

## Quick Start

```bash
# Basic analysis
./bin/cli.js -f /path/to/logfile.log

# Nginx access log with detailed stats
./bin/cli.js -f /path/to/access.log -t nginx

# JSON output for programmatic use  
./bin/cli.js -f /path/to/app.log -t json -o json

# Real-time monitoring with filters
./bin/cli.js -f /path/to/app.log -w --severity error

# Filter by date range and export to CSV
./bin/cli.js -f /path/to/access.log -t nginx --after 2024-12-20 --before 2024-12-25 -o csv
```

## Supported Log Types

- **nginx** - Nginx access logs with HTTP stats, IP analysis, status codes
- **apache** - Apache access logs with bytes transferred tracking  
- **syslog** - System logs with process and severity analysis
- **iis** - IIS web server logs with detailed request metrics
- **json** - Structured JSON logs with service and error tracking
- **generic** (default) - Basic text logs with error/warning detection

## Output Formats

- **table** (default) - Human-readable formatted output
- **json** - Structured JSON for APIs and scripting
- **csv** - Comma-separated values for spreadsheet import

## Filtering Options

```bash
# Date filtering
--after 2024-12-20        # Logs after date
--before 2024-12-25       # Logs before date

# Content filtering  
--include "error|warn"     # Include lines matching regex
--exclude "debug"          # Exclude lines matching regex
--severity warn           # Minimum severity level

# Network filtering
--status 404,500          # Filter by HTTP status codes
--ip 192.168.1.100        # Filter by specific IPs
--exclude-ip 127.0.0.1    # Exclude specific IPs
```

## Performance Features

- **Stream Processing**: Automatically used for files >50MB
- **Memory Efficient**: Processes large files without loading into memory  
- **Progress Tracking**: Shows progress for long-running operations
- **Configurable Limits**: Adjust memory and processing limits

## Configuration

Create a `.log-analyzer.json` file in your project or home directory:

```json
{
  "output": {
    "colors": true,
    "maxLines": 10000
  },
  "watcher": {
    "pollInterval": 1000
  },
  "filters": {
    "minSeverity": "info"
  }
}
```

## Real-time Monitoring

```bash
# Watch file for changes
./bin/cli.js -f /path/to/app.log -w

# Watch with verbose output and filtering
./bin/cli.js -f /path/to/access.log -t nginx -w -v --status 4xx,5xx
```

## Examples

The `examples/` directory contains sample log files for testing:
- `nginx_access.log` - Nginx access logs
- `apache_access.log` - Apache access logs  
- `syslog.log` - System log entries
- `app.json.log` - JSON structured logs
- `generic.log` - Basic text logs

## Installation

```bash
npm install -g log-analyzer
```

## Development

```bash
npm start
npm run dev  # Watch mode
```