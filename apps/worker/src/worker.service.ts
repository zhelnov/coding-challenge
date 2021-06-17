import {
  HttpService,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface EthPrice {
  ethbtc: string;
  ethbtc_timestamp: string;
  ethusd: string;
  ethusd_timestamp: string;
}

@Injectable()
export class WorkerService {
  private intervalId: NodeJS.Timeout;

  constructor(
    @Inject('DATA_SERVICE') private client: ClientProxy,
    private readonly httpService: HttpService,
  ) {}

  start(interval: number) {
    console.log(`start with ${interval} interval`);
    this.intervalId = setInterval(() => {
      this.doWork(); // dont await
    }, 2000);
  }

  stop() {
    console.log('stop');
    clearInterval(this.intervalId);
  }

  async doWork() {
    try {
      const result = await this.getEthPrice();
      return this.client.send({ cmd: 'receive' }, result).toPromise();
    } catch (error) {
      // here just skip step, todo proper handing, maybe DLQ
      console.error(error);
    }
  }

  async getEthPrice(): Promise<EthPrice> {
    const result = await this.httpService.get('').toPromise();
    if (result.data && result.data.message === 'OK') {
      return result.data.result as EthPrice;
    }
    throw new InternalServerErrorException('bad response');
  }
}
