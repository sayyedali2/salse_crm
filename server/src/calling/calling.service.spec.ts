import { Test, TestingModule } from '@nestjs/testing';
import { CallingService } from './calling.service';

describe('CallingService', () => {
  let service: CallingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallingService],
    }).compile();

    service = module.get<CallingService>(CallingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
