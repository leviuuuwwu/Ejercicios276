import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    //Encuentra al usuario por email o lo crea si no existe (para login con Google)
    async findOrCreate(data: { email: string; name: string }): Promise<User> {
        let user = await this.usersRepository.findOne({ where: { email: data.email } });
        if (!user) {
            user = this.usersRepository.create(data);
            await this.usersRepository.save(user);
        }
        return user;
    }

    //Buscar por ID (para otros modulos como rentals)    
    async findById(id: number): Promise<User | null > {
        return this.usersRepository.findOne({ where: { id } });
    }

    //(Opcional) Obtener todos los usuarios - solo si lo habilitas en controller
    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

}