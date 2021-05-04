import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const initMicroservice = async (app: INestApplication) => {
  const microservice = app.connectMicroservice({});

  await app.startAllMicroservicesAsync();
  microservice.listen(() => console.log('microservice is listening'));
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initMicroservice(app);
  await app.listen(3000);
}
bootstrap();
