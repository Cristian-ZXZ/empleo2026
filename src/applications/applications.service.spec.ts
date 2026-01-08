import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,

    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,
  ) {}

  async apply(user: User, vacancyId: number) {
    const vacancy = await this.vacancyRepo.findOne({
      where: { id: vacancyId },
    });

    if (!vacancy) {
      throw new BadRequestException('Vacante no existe');
    }

    const exists = await this.appRepo.findOne({
      where: {
        user: { id: user.id },
        vacancy: { id: vacancyId },
      },
    });

    if (exists) {
      throw new BadRequestException(
        'Ya aplicaste a esta vacante',
      );
    }

    const application = this.appRepo.create({
      user,
      vacancy,
    });

    return this.appRepo.save(application);
  }
}
