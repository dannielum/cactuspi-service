const request = require('request');

module.exports = class Weather {
  constructor(config) {
    this._config = config;

    // get the config params
    const { params } = config;

    // define your api url
    this._url = `http://your-api.com?params=${params}}&appKey=${apiKey}`;
  }

  init() {
    // do init works
  }

  fetch(callback, errorCallback, req) {
    // do fetch work
    const param = req.params.param; // get query params

    request(this._url, (error, response, body) => {
      if (error) {
        errorCallback(error);
      }

      const message = JSON.parse(body);

      callback(message, {
        repeat: false, // whether this message will loop in the cactuspi-client
        name: 'api-name', // name of your api
        duration: 35, // number of seconds to run
        priority: false, // display immediate or push to queue
      });
    });
  }
};
