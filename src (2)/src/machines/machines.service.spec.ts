import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Machine } from './machine.entity/machine.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity/user.entity';

describe('MachinesService', () => {
  let service: MachinesService;
  let repo: Repository<Machine>;
  let usersService: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'User',
    email: 'user@example.com',
    role: 'user',
    machines: [],
    rentals: [],
  } as User;

  const mockMachine = {
    id: 1,
    name: 'Machine',
    description: 'Desc',
    createdBy: mockUser,
    available: true,
  };

  const mockMachineRepo = {
    create: jest.fn().mockImplementation((dto) => ({
      id: 1,
      ...dto,
      createdBy: mockUser,
      available: true,
    })),
    save: jest.fn().mockImplementation((machine) => Promise.resolve(machine)),
    find: jest.fn().mockResolvedValue([mockMachine]),  // jest.fn() para que tenga mockResolvedValueOnce
  };

  const mockUsersService = {
    findById: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachinesService,
        {
          provide: getRepositoryToken(Machine),
          useValue: mockMachineRepo,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
    repo = module.get(getRepositoryToken(Machine));
    usersService = module.get<UsersService>(UsersService);

    mockMachineRepo.create.mockClear();
    mockMachineRepo.save.mockClear();
    mockMachineRepo.find.mockClear();

    mockUsersService.findById.mockClear();
    mockUsersService.findById.mockResolvedValue(mockUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a machine with valid user', async () => {
    const dto = { name: 'Excavadora', description: 'Grande' };
    const jwtPayload = { userId: 1 };

    const result = await service.create(dto, jwtPayload);

    expect(usersService.findById).toHaveBeenCalledWith(1);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
      name: dto.name,
      description: dto.description,
      createdBy: mockUser,
      available: true,
    }));
    expect(result).toEqual(expect.objectContaining({
      name: dto.name,
      description: dto.description,
      createdBy: mockUser,
      available: true,
    }));
  });

  it('should throw if user is not found', async () => {
    mockUsersService.findById.mockResolvedValueOnce(null);

    const dto = { name: 'Grúa', description: 'Alta' };
    await expect(service.create(dto, { userId: 999 })).rejects.toThrow('Usuario no encontrado');
  });

  it('should return all machines with findAll', async () => {
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({ relations: ['createdBy'] });
    expect(result).toEqual([mockMachine]);
  });

  it('should call repo.create with correct dto', async () => {
    const dto = { name: 'Bulldozer', description: 'Heavy machine' };
    const jwtPayload = { userId: 1 };

    const result = await service.create(dto, jwtPayload);

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      name: dto.name,
      description: dto.description,
      createdBy: mockUser,
      available: true,
    }));
  });

  it('should create machine with correct properties', async () => {
    const dto = { name: 'Bulldozer', description: 'Heavy machine' };
    const jwtPayload = { userId: 1 };

    const result = await service.create(dto, jwtPayload);

    expect(result.name).toBe(dto.name);
    expect(result.description).toBe(dto.description);
    expect(result.available).toBe(true);
    expect(result.createdBy).toEqual(mockUser);
  });

  it('should call usersService.findById when creating machine', async () => {
    const dto = { name: 'Tractor', description: 'Farm machine' };
    const jwtPayload = { userId: 1 };

    await service.create(dto, jwtPayload);

    expect(usersService.findById).toHaveBeenCalledWith(jwtPayload.userId);
  });

it('should return empty array when no machines found', async () => {
  mockMachineRepo.find.mockResolvedValue([]);
  
  const result = await service.findAll();
  
  expect(result).toEqual([]);
  expect(mockMachineRepo.find).toHaveBeenCalledWith({ relations: ['createdBy'] });
  });
});
