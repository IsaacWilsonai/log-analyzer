const path = require('path');

class NginxParser {
  constructor() {
    this.statusCodes = {
      '2xx': 0,
      '3xx': 0,
      '4xx': 0,
      '5xx': 0
    };
    this.methods = {};
    this.ips = {};
  }

  parseLine(line) {
    const nginxRegex = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) \S+" (\d+) (\d+) "([^"]*)" "([^"]*)"/;
    const match = line.match(nginxRegex);
    
    if (match) {
      const [, ip, timestamp, method, url, status, size, referer, userAgent] = match;
      
      const statusCategory = Math.floor(status / 100) + 'xx';
      if (this.statusCodes[statusCategory] !== undefined) {
        this.statusCodes[statusCategory]++;
      }
      
      this.methods[method] = (this.methods[method] || 0) + 1;
      this.ips[ip] = (this.ips[ip] || 0) + 1;
      
      return {
        ip,
        timestamp,
        method,
        url,
        status: parseInt(status),
        size: parseInt(size),
        referer,
        userAgent,
        type: 'nginx'
      };
    }
    
    return null;
  }

  getStats() {
    const topIps = Object.entries(this.ips)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([ip, count]) => ({ ip, count }));

    return {
      statusCodes: this.statusCodes,
      methods: this.methods,
      topIps
    };
  }
}

module.exports = NginxParser;