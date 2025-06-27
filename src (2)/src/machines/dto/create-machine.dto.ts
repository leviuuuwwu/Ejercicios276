// src/machines/dto/create-machine.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(10)
  description: string;
}
