const AWS = require('aws-sdk');

module.exports = class SQSPublisher {
  constructor(config) {
    AWS.config.update({
      region: config.region,
    });

    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

    this._topic = config.topic;
  }

  publish(message, meta) {
    if (!this.sqs) {
      throw new Error('SQS is not initialized');
    }

    const params = {
      MessageAttributes: {
        metadata: {
          DataType: 'String',
          StringValue: JSON.stringify(meta),
        },
      },
      MessageBody: message,
      QueueUrl: this._topic,
    };

    this.sqs.sendMessage(params, function (error, data) {
      if (error) {
        console.error('SQS', error);
      } else {
        console.log('SQS: Published with MessageId', data.MessageId);
      }
    });
  }
};
