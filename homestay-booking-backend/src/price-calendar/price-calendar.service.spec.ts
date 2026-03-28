import { Test, TestingModule } from '@nestjs/testing';
import { PriceCalendarService } from './price-calendar.service';

describe('PriceCalendarService', () => {
  let service: PriceCalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceCalendarService],
    }).compile();

    service = module.get<PriceCalendarService>(PriceCalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
