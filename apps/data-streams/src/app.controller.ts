import { Controller, Get, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('start')
  start(): any {
    return this.appService.start();
  }

  @Post('stop')
  stop(): any {
    return this.appService.stop();
  }

  @Get()
  getData(): any[] {
    return this.appService.getStorage();
  }

  @MessagePattern({ cmd: 'receive' })
  receive(data: any): void {
    return this.appService.receive(data);
  }
}
