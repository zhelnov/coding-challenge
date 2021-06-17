import { HttpModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATA_SERVICE',
        transport: Transport.TCP,
        options: { port: 3000 },
      },
    ]),
    HttpModule.register({
      baseURL: 'https://api.etherscan.io/api',
      params: {
        module: 'stats',
        action: 'ethprice',
        apikey: process.env.ETHSCAN_KEY,
      },
      responseType: 'json',
    }),
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
