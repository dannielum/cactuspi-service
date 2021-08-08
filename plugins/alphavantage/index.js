const request = require('request');

module.exports = class Weather {
  constructor(config) {
    this._config = config;
  }

  init() {}

  fetch(callback, errorCallback, req) {
    const { functionName, symbol: defaultSymbol, apikey } = this._config;
    const symbol = req.params.param || defaultSymbol;

    const url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=${apikey}`;

    request(url, (error, response, body) => {
      if (error) {
        return errorCallback(error);
      }

      const results = JSON.parse(body);

      if (results['Error Message']) {
        return errorCallback(results['Error Message']);
      }

      const message = this.parseMessage(functionName, results);

      callback(message, {
        repeat: false,
        name: 'alphavantage',
        duration: 35,
        priority: false,
      });
    });
  }

  parseMessage(functionName, results) {
    switch (functionName) {
      case 'GLOBAL_QUOTE':
        return `${results['Global Quote']['01. symbol']}: ${results['Global Quote']['05. price']}`;
      default:
        return 'invalid function name';
    }
  }
};
