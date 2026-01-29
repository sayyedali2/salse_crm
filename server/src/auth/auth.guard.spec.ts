import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/userSchema';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
