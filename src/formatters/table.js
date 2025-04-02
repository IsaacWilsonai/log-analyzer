class TableFormatter {
  static format(report) {
    let output = '';
    
    output += this.formatSection('Log Analysis Report', [
      ['File', report.file],
      ['Type', report.type],
      ['Total Lines', report.stats.totalLines],
      ['Errors', report.stats.errors],
      ['Warnings', report.stats.warnings]
    ]);
    
    if (report.detailedStats) {
      if (report.detailedStats.statusCodes) {
        output += this.formatSection('Status Codes', 
          Object.entries(report.detailedStats.statusCodes)
        );
      }
      
      if (report.detailedStats.methods) {
        output += this.formatSection('HTTP Methods', 
          Object.entries(report.detailedStats.methods)
        );
      }
      
      if (report.detailedStats.topIps && report.detailedStats.topIps.length > 0) {
        output += this.formatSection('Top IP Addresses', 
          report.detailedStats.topIps.map(({ ip, count }) => [ip, count])
        );
      }
      
      if (report.detailedStats.bytesTransferred) {
        output += this.formatSection('Data Transfer', [
          ['Total Bytes', this.formatBytes(report.detailedStats.bytesTransferred)]
        ]);
      }
    }
    
    return output;
  }

  static formatSection(title, data) {
    let output = `\n=== ${title} ===\n`;
    
    if (data.length === 0) {
      output += 'No data available\n';
      return output;
    }
    
    const maxKeyLength = Math.max(...data.map(([key]) => String(key).length));
    
    data.forEach(([key, value]) => {
      const paddedKey = String(key).padEnd(maxKeyLength);
      output += `${paddedKey} : ${value}\n`;
    });
    
    return output;
  }

  static formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = TableFormatter;