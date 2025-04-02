class JSONLogParser {
  constructor() {
    this.levels = {};
    this.services = {};
    this.errors = {};
  }

  parseLine(line) {
    try {
      const logEntry = JSON.parse(line);
      
      if (logEntry.level) {
        this.levels[logEntry.level] = (this.levels[logEntry.level] || 0) + 1;
      }
      
      if (logEntry.service || logEntry.logger || logEntry.name) {
        const service = logEntry.service || logEntry.logger || logEntry.name;
        this.services[service] = (this.services[service] || 0) + 1;
      }
      
      if (logEntry.error || logEntry.err) {
        const error = logEntry.error || logEntry.err;
        const errorType = error.type || error.name || 'UnknownError';
        this.errors[errorType] = (this.errors[errorType] || 0) + 1;
      }
      
      return {
        timestamp: logEntry.timestamp || logEntry.time || logEntry['@timestamp'],
        level: logEntry.level,
        message: logEntry.message || logEntry.msg,
        service: logEntry.service || logEntry.logger || logEntry.name,
        error: logEntry.error || logEntry.err,
        data: logEntry,
        type: 'json'
      };
    } catch (error) {
      return null;
    }
  }

  getStats() {
    return {
      levels: this.levels,
      services: this.services,
      errors: this.errors
    };
  }
}

module.exports = JSONLogParser;