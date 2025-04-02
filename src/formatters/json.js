class JSONFormatter {
  static format(report) {
    return JSON.stringify(report, null, 2);
  }

  static formatStream(entries) {
    return entries.map(entry => JSON.stringify(entry)).join('\n');
  }
}

module.exports = JSONFormatter;