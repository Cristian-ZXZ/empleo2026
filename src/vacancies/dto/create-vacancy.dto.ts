import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Backend Developer' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Experiencia en NestJS y PostgreSQL' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
