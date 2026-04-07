import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VoucherRedemptionService } from './voucher-redemption.service';
import { Voucher } from '../voucher/entities/voucher.entity';
import { VoucherRedemption } from './entities/voucher-redemption.entity';

describe('VoucherRedemptionService', () => {
  let service: VoucherRedemptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherRedemptionService,
        {
          provide: getRepositoryToken(Voucher),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(VoucherRedemption),
          useValue: {
            count: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VoucherRedemptionService>(VoucherRedemptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});