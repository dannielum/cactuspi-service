const request = require('request');

module.exports = class Weather {
  constructor(config) {
    const { city, unit, apiKey } = config;
    this._unit = unit;
    this._weatherUrl = `http://api.openweathermap.org/data/2.5/weather?zip=${city}&units=${unit}&appid=${apiKey}`;
  }

  init() {}

  fetch(callback, errorCallback) {
    request(this._weatherUrl, (error, response, body) => {
      if (error) {
        return errorCallback(error);
      }

      const result = JSON.parse(body);
      if (result.main === undefined) {
        return errorCallback(error);
      }

      const TEMP_UNITS = {
        default: 'K',
        metric: 'C',
        imperial: 'F',
      };
      const unit = TEMP_UNITS[this._unit];
      const temperature = `Now: ${Math.round(
        result.main.temp
      )}'${unit}. Today ${Math.round(
        result.main.temp_min
      )}'${unit} to ${Math.round(result.main.temp_max)}'${unit}.`;
      const condition = `Forecast: ${result.weather[0].description}. Humidity: ${result.main.humidity}%.`;
      const message = `${result.name} - ${temperature} ${condition}`;

      callback(message, {
        repeat: false,
        name: 'weather',
        duration: 35,
        priority: false,
      });
    });
  }
};
