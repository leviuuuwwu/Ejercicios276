import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MachinesService } from './machines.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateMachineDto } from './dto/create-machine.dto';

@ApiTags('machines')
@ApiBearerAuth()
@Controller('machines')
export class MachinesController {
    
    constructor(private readonly machinesService: MachinesService){}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() dto:CreateMachineDto, @Req() req:any){
        return this.machinesService.create(dto, req.user)
    }

    @Get()
    findAll(){
        return this.machinesService.findAll()
    }
}
