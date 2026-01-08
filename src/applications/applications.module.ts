import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Vacancy, User  ]),
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
