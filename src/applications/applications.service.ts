import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Application } from './entities/application.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,

    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,
  ) {}

  // ✅ USER aplica a una vacante
  async apply(user: JwtPayload, vacancyId: number) {
    const vacancy = await this.vacancyRepo.findOne({
      where: { id: vacancyId },
    });

    if (!vacancy) {
      throw new BadRequestException('Vacante no existe');
    }

    const alreadyApplied = await this.applicationRepo.findOne({
      where: {
        user: { id: user.userId },
        vacancy: { id: vacancyId },
      },
    });

    if (alreadyApplied) {
      throw new BadRequestException('Ya aplicaste a esta vacante');
    }

    const application = this.applicationRepo.create({
      user: { id: user.userId } as User,
      vacancy,
    });

    return this.applicationRepo.save(application);
  }

  // ✅ ADMIN / GESTOR listan postulaciones
  async findAll() {
    return this.applicationRepo.find({
      order: {
        appliedAt: 'DESC',
      },
    });
  }
}
