import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern({ cmd: 'start' })
  startPolling(interval: number): void {
    return this.workerService.start(interval);
  }

  @MessagePattern({ cmd: 'stop' })
  stopPolling(): void {
    return this.workerService.stop();
  }
}
