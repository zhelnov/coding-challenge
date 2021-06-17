import { HttpService, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  let service: WorkerService;

  const httpMock = {
    get: jest.fn(),
  };

  const dataMock = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        WorkerService,
        {
          provide: HttpService,
          useValue: httpMock,
        },
        {
          provide: 'DATA_SERVICE',
          useValue: dataMock,
        },
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.start).toBeDefined();
    expect(service.stop).toBeDefined();
    expect(service.doWork).toBeDefined();
    expect(service.getEthPrice).toBeDefined();
  });

  it('should make ethscan request correctly', async () => {
    const responseMock = {
      message: 'OK',
      result: {
        ethbtc: '0.06175',
        ethbtc_timestamp: '1623957218',
        ethusd: '2333.36',
        ethusd_timestamp: '1623957218',
      },
      status: 1,
    };
    httpMock.get.mockReturnValueOnce({
      toPromise: jest.fn().mockResolvedValueOnce({
        data: responseMock,
      }),
    });
    await expect(service.getEthPrice()).resolves.toEqual(responseMock.result);
    expect(httpMock.get).toBeCalledTimes(1);
    expect(httpMock.get).toBeCalledWith('');
  });

  it('should handle ethscan request error', async () => {
    const responseMock = {
      message: 'NOTOK',
      status: -1,
    };
    httpMock.get.mockReturnValueOnce({
      toPromise: jest.fn().mockResolvedValueOnce({
        data: responseMock,
      }),
    });
    await expect(service.getEthPrice()).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(httpMock.get).toBeCalledTimes(1);
    expect(httpMock.get).toBeCalledWith('');
  });

  it('should handle ethscan transport error', async () => {
    httpMock.get.mockReturnValueOnce({
      toPromise: jest.fn().mockRejectedValueOnce(new Error('somerror')),
    });
    await expect(service.getEthPrice()).rejects.toThrow('somerror');
    expect(httpMock.get).toBeCalledTimes(1);
    expect(httpMock.get).toBeCalledWith('');
  });

  it('should run correct iteration of work', async () => {
    const responseMock = {
      message: 'OK',
      result: {
        ethbtc: '0.06175',
        ethbtc_timestamp: '1623957218',
        ethusd: '2333.36',
        ethusd_timestamp: '1623957218',
      },
      status: 1,
    };
    httpMock.get.mockReturnValueOnce({
      toPromise: jest.fn().mockResolvedValueOnce({
        data: responseMock,
      }),
    });
    dataMock.send.mockReturnValueOnce({
      toPromise: jest.fn().mockResolvedValueOnce(null),
    });
    await expect(service.doWork()).resolves.toEqual(null);
    expect(httpMock.get).toBeCalledTimes(1);
    expect(httpMock.get).toBeCalledWith('');
    expect(dataMock.send).toBeCalledTimes(1);
    expect(dataMock.send).toBeCalledWith(
      { cmd: 'receive' },
      responseMock.result,
    );
  });

  it('should not fail iteration if request failed', async () => {
    httpMock.get.mockReturnValueOnce({
      toPromise: jest.fn().mockRejectedValueOnce(new Error('somerror')),
    });
    await expect(service.doWork()).resolves.toEqual(undefined);
    expect(httpMock.get).toBeCalledTimes(1);
    expect(httpMock.get).toBeCalledWith('');
    expect(dataMock.send).not.toBeCalled();
  });
});
