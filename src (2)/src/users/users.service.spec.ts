import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find or create a user', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    const usersRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockReturnValue(mockUser),
      save: jest.fn().mockResolvedValue(mockUser),
    };

    (service as any).usersRepository = usersRepository;

    const result = await service.findOrCreate({ email: 'test@example.com', name: 'Test User' });

    expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(usersRepository.create).toHaveBeenCalledWith({ email: 'test@example.com', name: 'Test User' });
    expect(usersRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });
});
