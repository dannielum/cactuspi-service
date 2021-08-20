import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

module.exports = class SQSPublisher {
  constructor(config) {
    this.sqs = new SQSClient({ region: config.region });

    this._topic = config.topic;
  }

  async publish(message, meta) {
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

    try {
      const data = await sqsClient.send(new SendMessageCommand(params));
      console.log('SQS: Published with MessageId', data.MessageId);
    } catch (err) {
      console.error('SQS', error);
    }
  }
};
