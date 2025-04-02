class CSVFormatter {
  static format(report) {
    let output = '';
    
    output += 'File,Type,TotalLines,Errors,Warnings\n';
    output += `"${report.file}","${report.type}",${report.stats.totalLines},${report.stats.errors},${report.stats.warnings}\n`;
    
    if (report.detailedStats) {
      if (report.detailedStats.statusCodes) {
        output += '\nStatus Code,Count\n';
        Object.entries(report.detailedStats.statusCodes).forEach(([code, count]) => {
          output += `${code},${count}\n`;
        });
      }
      
      if (report.detailedStats.methods) {
        output += '\nHTTP Method,Count\n';
        Object.entries(report.detailedStats.methods).forEach(([method, count]) => {
          output += `${method},${count}\n`;
        });
      }
      
      if (report.detailedStats.topIps) {
        output += '\nIP Address,Requests\n';
        report.detailedStats.topIps.forEach(({ ip, count }) => {
          output += `${ip},${count}\n`;
        });
      }
    }
    
    return output;
  }

  static formatHeaders(fields) {
    return fields.map(field => `"${field}"`).join(',') + '\n';
  }

  static formatRow(data) {
    return data.map(value => {
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',') + '\n';
  }
}

module.exports = CSVFormatter;