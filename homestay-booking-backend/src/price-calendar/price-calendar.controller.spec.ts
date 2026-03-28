import { Test, TestingModule } from '@nestjs/testing';
import { PriceCalendarController } from './price-calendar.controller';
import { PriceCalendarService } from './price-calendar.service';

describe('PriceCalendarController', () => {
  let controller: PriceCalendarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceCalendarController],
      providers: [PriceCalendarService],
    }).compile();

    controller = module.get<PriceCalendarController>(PriceCalendarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
