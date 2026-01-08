import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Vacancies')
@ApiBearerAuth('access-token')
@Controller('vacancies')
export class VacanciesController {
  constructor(
    private readonly vacanciesService: VacanciesService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'Listar vacantes activas' })
  findAll() {
    return this.vacanciesService.findAll();
  }


  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.GESTOR)
  @ApiOperation({ summary: 'Crear vacante (ADMIN / GESTOR)' })
  create(@Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(dto);
  }
}
