# Cactus Pi Service

A backend service to be consumed by [CactusPI Server](https://github.com/dannielum/cactuspi-server) and [CactusPI Serverless](https://github.com/dannielum/cactuspi-serverless).

## Services

- Publisher
  - AWS SQS
  - PubNub
  - MQTT (Home Assistant)

## Plugins

- [Weather](./plugins/weather/)
- [Bustime](./plugins/bustime/)
- [AlphaVantage](./plugins/alphavantage/)

[Set up plugin configs](./plugins/#Plugin-Configs)

[Create your own plugins](./plugins/#Create-Your-Own-Plugins)

## Instructions

You can import this library for your own service.

1. `npm install cactuspi-service`

2. Create config.json in your server project. You need to set up the configurations needed for each plugin and the publish service. Read more about the config set up for the [plugins](./plugins/#Plugin-Configs).

3. Import the library in your service.

```js
// import the library
const { Publisher, Plugins } = require('cactuspi-service');

// Create the publisher instance
const publisher = new Publisher(config);

// Create the plugins
pluginServices.forEach(({ name, service, options }) => {
  const plugin = new service(options);
  if (plugin.init) {
    plugin.init();
  }

  // register the end poins for each plugin
  app.get(`/${name}/:param?`, (req, res) => {
    plugin.fetch(
      (message, metadata) => {
        publisher.publish(message, metadata);

        res.status(200);
        res.send({ message, metadata });
      },
      (error) => {
        res.status(500);
        res.send({
          name: `Plugin Error: ${name}`,
          error,
        });
      }
    );
  });
});
```
