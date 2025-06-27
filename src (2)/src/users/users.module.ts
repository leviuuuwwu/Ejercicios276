import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity/user.entity';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
