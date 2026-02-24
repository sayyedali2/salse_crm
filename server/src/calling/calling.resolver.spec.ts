import { Test, TestingModule } from '@nestjs/testing';
import { CallingResolver } from './calling.resolver';

describe('CallingResolver', () => {
  let resolver: CallingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallingResolver],
    }).compile();

    resolver = module.get<CallingResolver>(CallingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
