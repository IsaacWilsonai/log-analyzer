class ApacheParser {
  constructor() {
    this.statusCodes = {};
    this.methods = {};
    this.bytesTransferred = 0;
  }

  parseLine(line) {
    const apacheRegex = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) \S+" (\d+) (\d+|-)/;
    const match = line.match(apacheRegex);
    
    if (match) {
      const [, ip, timestamp, method, url, status, size] = match;
      
      this.statusCodes[status] = (this.statusCodes[status] || 0) + 1;
      this.methods[method] = (this.methods[method] || 0) + 1;
      
      if (size !== '-') {
        this.bytesTransferred += parseInt(size);
      }
      
      return {
        ip,
        timestamp,
        method,
        url,
        status: parseInt(status),
        size: size === '-' ? 0 : parseInt(size),
        type: 'apache'
      };
    }
    
    return null;
  }

  getStats() {
    return {
      statusCodes: this.statusCodes,
      methods: this.methods,
      bytesTransferred: this.bytesTransferred
    };
  }
}

module.exports = ApacheParser;