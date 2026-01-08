import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyVacancyDto {
  @ApiProperty({ example: 1, description: 'ID de la vacante' })
  @IsInt()
  vacancyId: number;
}
