import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/user.entity/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Reset mocks before each test
    mockUserRepository.findOne.mockReset();
    mockUserRepository.create.mockReset();
    mockUserRepository.save.mockReset();
    mockUserRepository.find.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreate', () => {
    it('should return existing user if found', async () => {
      const existingUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      const result = await service.findOrCreate({ email: 'test@example.com', name: 'Test User' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(existingUser);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should create and save user if not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const createdUser = { id: 2, email: 'new@example.com', name: 'New User' };
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      const result = await service.findOrCreate({ email: 'new@example.com', name: 'New User' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
      expect(mockUserRepository.create).toHaveBeenCalledWith({ email: 'new@example.com', name: 'New User' });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(99);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
});
