class SyslogParser {
  constructor() {
    this.facilities = {};
    this.severities = {};
    this.processes = {};
  }

  parseLine(line) {
    const syslogRegex = /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+([^:\[\s]+)(?:\[(\d+)\])?:\s*(.*)$/;
    const match = line.match(syslogRegex);
    
    if (match) {
      const [, timestamp, hostname, process, pid, message] = match;
      
      this.processes[process] = (this.processes[process] || 0) + 1;
      
      const severity = this.extractSeverity(message);
      if (severity) {
        this.severities[severity] = (this.severities[severity] || 0) + 1;
      }
      
      return {
        timestamp,
        hostname,
        process,
        pid: pid ? parseInt(pid) : null,
        message: message.trim(),
        severity,
        type: 'syslog'
      };
    }
    
    return null;
  }

  extractSeverity(message) {
    const severityRegex = /\b(DEBUG|INFO|NOTICE|WARN|WARNING|ERROR|CRIT|ALERT|EMERG)\b/i;
    const match = message.match(severityRegex);
    return match ? match[1].toUpperCase() : null;
  }

  getStats() {
    return {
      processes: this.processes,
      severities: this.severities
    };
  }
}

module.exports = SyslogParser;