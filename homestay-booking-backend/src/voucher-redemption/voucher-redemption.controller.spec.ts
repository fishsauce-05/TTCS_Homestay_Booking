import { Test, TestingModule } from '@nestjs/testing';
import { VoucherRedemptionController } from './voucher-redemption.controller';
import { VoucherRedemptionService } from './voucher-redemption.service';

describe('VoucherRedemptionController', () => {
  let controller: VoucherRedemptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherRedemptionController],
      providers: [
        {
          provide: VoucherRedemptionService,
          useValue: {
            getAllRedemptions: jest.fn(),
            getRedemptionsByVoucherId: jest.fn(),
            getRedemptionByBookingId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VoucherRedemptionController>(VoucherRedemptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});