import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { Vacancy } from './entities/vacancy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacancy]),
  ],
  controllers: [VacanciesController],
  providers: [VacanciesService],
  exports: [
    TypeOrmModule,  
  ],
})
export class VacanciesModule {}
