import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly storage: any[] = [];

  constructor(@Inject('WORKER_SERVICE') private client: ClientProxy) {}

  start() {
    return this.client.send<number>({ cmd: 'start' }, 2000);
  }

  stop() {
    return this.client.send<void>({ cmd: 'stop' }, {});
  }

  getStorage(): any[] {
    return this.storage;
  }

  receive(data: any) {
    this.storage.push(data);
  }
}
