import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

import { ApplicationsService } from './applications.service';
import { ApplyVacancyDto } from './dto/apply-vacancy.dto';

@ApiTags('Applications')
@ApiBearerAuth('access-token')
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.GESTOR)
  @ApiOperation({
    summary: 'Listar todas las postulaciones (ADMIN / GESTOR)',
  })
  findAll() {
    return this.applicationsService.findAll();
  }

  @Post('apply')
  @Roles(Role.CODER)
  @ApiOperation({
    summary: 'Postular a una vacante (CODER)',
  })
  apply(@Req() req, @Body() dto: ApplyVacancyDto) {
    return this.applicationsService.apply(
      req.user,
      dto.vacancyId,
    );
  }
}
