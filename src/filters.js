class LogFilter {
  constructor(options = {}) {
    this.startDate = options.startDate;
    this.endDate = options.endDate;
    this.includePatterns = options.includePatterns || [];
    this.excludePatterns = options.excludePatterns || [];
    this.minSeverity = options.minSeverity;
    this.statusCodes = options.statusCodes || [];
    this.ipAddresses = options.ipAddresses || [];
    this.excludeIPs = options.excludeIPs || [];
  }

  shouldIncludeLine(line, parsedData = null) {
    if (this.excludePatterns.length > 0) {
      for (const pattern of this.excludePatterns) {
        if (new RegExp(pattern, 'i').test(line)) {
          return false;
        }
      }
    }

    if (this.includePatterns.length > 0) {
      let found = false;
      for (const pattern of this.includePatterns) {
        if (new RegExp(pattern, 'i').test(line)) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }

    if (this.minSeverity) {
      const severity = this.extractSeverity(line);
      if (severity && !this.meetsSeverityThreshold(severity)) {
        return false;
      }
    }

    if (parsedData) {
      if (this.statusCodes.length > 0 && parsedData.status) {
        if (!this.statusCodes.includes(String(parsedData.status))) {
          return false;
        }
      }

      if (parsedData.ip) {
        if (this.excludeIPs.length > 0 && this.excludeIPs.includes(parsedData.ip)) {
          return false;
        }

        if (this.ipAddresses.length > 0 && !this.ipAddresses.includes(parsedData.ip)) {
          return false;
        }
      }

      if (this.startDate || this.endDate) {
        const logDate = this.parseLogDate(parsedData.timestamp || line);
        if (logDate) {
          if (this.startDate && logDate < this.startDate) return false;
          if (this.endDate && logDate > this.endDate) return false;
        }
      }
    }

    return true;
  }

  extractSeverity(line) {
    const severityRegex = /\b(DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL)\b/i;
    const match = line.match(severityRegex);
    return match ? match[1].toUpperCase() : null;
  }

  meetsSeverityThreshold(severity) {
    const levels = {
      'DEBUG': 0,
      'INFO': 1,
      'WARN': 2,
      'WARNING': 2,
      'ERROR': 3,
      'FATAL': 4,
      'CRITICAL': 4
    };

    const minLevel = levels[this.minSeverity.toUpperCase()];
    const currentLevel = levels[severity];

    return currentLevel !== undefined && currentLevel >= minLevel;
  }

  parseLogDate(timestamp) {
    if (!timestamp) return null;
    
    try {
      if (timestamp.includes('/')) {
        const match = timestamp.match(/\[([^\]]+)\]/);
        if (match) {
          return new Date(match[1].replace(/\/(\w{3})\//, ' $1 '));
        }
      }
      
      const match = timestamp.match(/\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/);
      if (match) {
        return new Date(match[0]);
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  static fromOptions(options) {
    const filterOptions = {};
    
    if (options.after) filterOptions.startDate = new Date(options.after);
    if (options.before) filterOptions.endDate = new Date(options.before);
    if (options.include) filterOptions.includePatterns = [options.include];
    if (options.exclude) filterOptions.excludePatterns = [options.exclude];
    if (options.severity) filterOptions.minSeverity = options.severity;
    if (options.status) filterOptions.statusCodes = options.status.split(',');
    if (options.ip) filterOptions.ipAddresses = options.ip.split(',');
    if (options.excludeIp) filterOptions.excludeIPs = options.excludeIp.split(',');

    return new LogFilter(filterOptions);
  }
}

module.exports = LogFilter;