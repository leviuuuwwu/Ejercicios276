// machines.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { Machine } from './machine.entity/machine.entity'; 
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Machine]), 
    UsersModule, 
  ],
  providers: [MachinesService],
  controllers: [MachinesController],
})
export class MachinesModule {}

