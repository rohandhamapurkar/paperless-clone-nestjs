import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Logger } from '@nestjs/common';

const logger = new Logger('AwsSqsProducer');

type AwsConfig = {
  queueUrl: string;
  secretAccessKey: string;
  accessKeyId: string;
  region: string;
  cronExpression: string;
  timezone: string;
};

class AwsSqsProducer extends ClientProxy {
  private sqsClient: SQSClient;
  private config: AwsConfig;
  constructor(config: AwsConfig) {
    super();
    this.config = config;
    this.sqsClient = new SQSClient({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  async connect(): Promise<any> {
    logger.log('Initialized AWS SQS client');
  }

  async close() {
    // logger.log('close');
  }

  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    logger.log('event to dispatch: ', packet);

    const command = new SendMessageCommand({
      QueueUrl: this.config.queueUrl,
      MessageBody: JSON.stringify({
        eventName: packet.pattern,
        ...packet.data,
      }),
    });

    this.sqsClient.send(command).then((response) => {
      logger.debug(
        'send command status code:',
        response.$metadata.httpStatusCode === 200 ? 'success' : 'error',
      );
    });
    return;
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ) {
    callback({ response: false });
    return () => console.log('teardown');
  }
}

export default AwsSqsProducer;
