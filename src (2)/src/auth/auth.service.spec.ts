import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findOrCreate: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findOrCreate: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked.token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call usersService.findOrCreate with email and name', async () => {
    await service.validateOAuthLogin('test@example.com', 'Test User');
    expect(usersService.findOrCreate).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('should call jwtService.sign with correct payload', async () => {
    await service.validateOAuthLogin('test@example.com', 'Test User');
    expect(jwtService.sign).toHaveBeenCalledWith({
      email: 'test@example.com',
      sub: 1,
    });
  });

  it('should return an access_token string', async () => {
    const result = await service.validateOAuthLogin('test@example.com', 'Test User');
    expect(result).toEqual({ access_token: 'mocked.token' });
  });

  it('should throw if findOrCreate throws', async () => {
    usersService.findOrCreate.mockRejectedValueOnce(new Error('DB error'));
    await expect(service.validateOAuthLogin('x@y.com', 'X')).rejects.toThrow('DB error');
  });

  it('should throw if jwtService.sign throws', async () => {
    jwtService.sign.mockImplementationOnce(() => {
      throw new Error('Sign failed');
    });
    await expect(service.validateOAuthLogin('x@y.com', 'X')).rejects.toThrow('Sign failed');
  });

  it('should return access_token as string type', async () => {
    const result = await service.validateOAuthLogin('test@example.com', 'Test User');
    expect(typeof result.access_token).toBe('string');
  });
});
