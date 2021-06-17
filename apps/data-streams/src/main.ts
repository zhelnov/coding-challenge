import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const initMicroservice = async (app: INestApplication) => {
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    // options: {
    //   urls: ['amqp://localhost:5672'],
    //   queue: 'eth_queue',
    //   queueOptions: {
    //     durable: false
    //   },
    // },
  });
  await app.startAllMicroservicesAsync();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initMicroservice(app);
  await app.listen(3000);
}
bootstrap();
