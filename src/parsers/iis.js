class IISParser {
  constructor() {
    this.statusCodes = {};
    this.methods = {};
    this.userAgents = {};
    this.bytesTransferred = 0;
  }

  parseLine(line) {
    if (line.startsWith('#')) return null;
    
    const fields = line.split(' ');
    if (fields.length < 10) return null;
    
    const [date, time, sIP, csMethod, csUriStem, csUriQuery, sPort, csUsername, cIP, csUserAgent, scStatus, scSubstatus, scWin32Status, timeTaken, csBytes, scBytes] = fields;
    
    const method = csMethod;
    const status = parseInt(scStatus);
    const bytes = parseInt(scBytes) || 0;
    
    if (method && method !== '-') {
      this.methods[method] = (this.methods[method] || 0) + 1;
    }
    
    if (!isNaN(status)) {
      this.statusCodes[status] = (this.statusCodes[status] || 0) + 1;
    }
    
    this.bytesTransferred += bytes;
    
    return {
      timestamp: `${date} ${time}`,
      serverIP: sIP,
      method,
      uri: csUriStem,
      query: csUriQuery !== '-' ? csUriQuery : null,
      port: parseInt(sPort),
      username: csUsername !== '-' ? csUsername : null,
      clientIP: cIP,
      userAgent: csUserAgent !== '-' ? decodeURIComponent(csUserAgent) : null,
      status,
      substatus: parseInt(scSubstatus),
      win32Status: parseInt(scWin32Status),
      timeTaken: parseInt(timeTaken),
      clientBytes: parseInt(csBytes) || 0,
      serverBytes: bytes,
      type: 'iis'
    };
  }

  getStats() {
    return {
      statusCodes: this.statusCodes,
      methods: this.methods,
      bytesTransferred: this.bytesTransferred
    };
  }
}

module.exports = IISParser;