/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class MessagingService implements OnModuleInit {
  private publisher = createClient();
  private subscriber = createClient();

  async onModuleInit() {
    await this.publisher.connect();
    await this.subscriber.connect();
  }

  async publish(channel: string, data: any) {
    const message = JSON.stringify(data);
    await this.publisher.publish(channel, message);
  }

  async subscribe(channel: string, handler: (data: any) => void) {
    await this.subscriber.subscribe(channel, (message) => {
      const data = JSON.parse(message);
      handler(data);
    });
  }
}
