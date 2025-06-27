import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RentalRequest } from './rental-request.entity/rental-request.entity';
import { Machine } from 'src/machines/machine.entity/machine.entity';
import { CreateRentalDto } from './dto/create-rental.dto';

describe('RentalsService', () => {
  let service: RentalsService;

  const mockRentalRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockMachineRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: getRepositoryToken(RentalRequest),
          useValue: mockRentalRepo,
        },
        {
          provide: getRepositoryToken(Machine),
          useValue: mockMachineRepo,
        },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);

    mockRentalRepo.create.mockReset();
    mockRentalRepo.save.mockReset();
    mockRentalRepo.find.mockReset();
    mockMachineRepo.findOneBy.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a rental when machine exists', async () => {
    const dto: CreateRentalDto = {
      machineId: 1,
      startDate: '2025-07-01T00:00:00.000Z',
      endDate: '2025-07-05T00:00:00.000Z',
    };
    const user = { id: 1 };

    const mockMachine = { id: 1, name: 'Excavator' };
    mockMachineRepo.findOneBy.mockResolvedValue(mockMachine);

    const mockRental = {
      ...dto,
      machine: mockMachine,
      user: { id: user.id },
      status: 'pending',
    };
    mockRentalRepo.create.mockReturnValue(mockRental);
    mockRentalRepo.save.mockResolvedValue(mockRental);

    const result = await service.create(dto, user as any);

    expect(mockMachineRepo.findOneBy).toHaveBeenCalledWith({ id: dto.machineId });
    expect(mockRentalRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      startDate: dto.startDate,
      endDate: dto.endDate,
      machine: mockMachine,
      user: { id: user.id },
      status: 'pending',
    }));
    expect(mockRentalRepo.save).toHaveBeenCalledWith(mockRental);
    expect(result).toEqual(mockRental);
  });

  it('should throw error if machine does not exist', async () => {
    const dto: CreateRentalDto = {
      machineId: 999,
      startDate: '2025-07-01T00:00:00.000Z',
      endDate: '2025-07-05T00:00:00.000Z',
    };
    const user = { id: 1 };

    mockMachineRepo.findOneBy.mockResolvedValue(null);

    await expect(service.create(dto, user as any)).rejects.toThrow(`La maquina ${dto.machineId} no ha sido encontrada`);
  });

  it('should find rentals by user', async () => {
    const userId = 1;
    const mockRentals = [
      { id: 1, user: { id: userId }, machine: { id: 2 } },
      { id: 2, user: { id: userId }, machine: { id: 3 } },
    ];

    mockRentalRepo.find.mockResolvedValue(mockRentals);

    const result = await service.findByUser(userId);

    expect(mockRentalRepo.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
      relations: ['machine', 'user'],
    });

    expect(result).toEqual(mockRentals);
  });

  it('should throw if rentalRepo.create throws', async () => {
    const dto: CreateRentalDto = {
      machineId: 1,
      startDate: '2025-07-01T00:00:00.000Z',
      endDate: '2025-07-05T00:00:00.000Z',
    };
    const user = { id: 1 };

    mockMachineRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Excavator' });
    mockRentalRepo.create.mockImplementation(() => {
      throw new Error('Create failed');
    });

    await expect(service.create(dto, user as any)).rejects.toThrow('Create failed');
  });

  it('should throw if rentalRepo.save throws', async () => {
    const dto: CreateRentalDto = {
      machineId: 1,
      startDate: '2025-07-01T00:00:00.000Z',
      endDate: '2025-07-05T00:00:00.000Z',
    };
    const user = { id: 1 };

    mockMachineRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Excavator' });
    mockRentalRepo.create.mockReturnValue({
      ...dto,
      machine: { id: 1, name: 'Excavator' },
      user: { id: 1 },
      status: 'pending',
    });
    mockRentalRepo.save.mockImplementation(() => {
      throw new Error('Save failed');
    });

    await expect(service.create(dto, user as any)).rejects.toThrow('Save failed');
  });

  it('should return empty array if no rentals found by user', async () => {
    const userId = 1;
    mockRentalRepo.find.mockResolvedValue([]);

    const result = await service.findByUser(userId);
    expect(result).toEqual([]);
  });
});
