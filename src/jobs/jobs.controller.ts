import { Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JOB_SERVICE_MESSAGE_PATTERNS } from './constants';

@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(
    @Inject('JOB_SERVICE_TCP') private tcpClient: ClientProxy,
    @Inject('JOB_SERVICE_RMQ') private rmqClient: ClientProxy,
  ) {}
  @Post('test-rmq')
  sendRmqTestEvent() {
    this.rmqClient
      .send(JOB_SERVICE_MESSAGE_PATTERNS.CREATE_JOB, {
        userId: '625fa052eb9979eb7b4d2bc5',
        templateId: '625fa052eb9979eb7b4d2bc5',
        dataConfig: [
          {
            type: 'test',
            position: { angle: 1, scaleX: 1, scaleY: 1, left: 1, top: 1 },
          },
        ],
      })
      .subscribe({
        next: (v) => console.log(v),
        error: (e) => console.error(e),
        complete: () => console.info('complete'),
      });
  }

  @Post('test-tcp')
  sendTcpTestEvent() {
    this.tcpClient
      .send(JOB_SERVICE_MESSAGE_PATTERNS.GET_JOB, [1, 2, 3, 4])
      .subscribe({
        next: (v) => console.log(v),
        error: (e) => console.error(e),
        complete: () => console.info('complete'),
      });
  }
}
