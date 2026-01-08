import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,
  ) {}

  async create(dto: CreateVacancyDto) {
    const vacancy = this.vacancyRepo.create({
      title: dto.title,
      description: dto.description,
      isActive: true,
    });

    const saved = await this.vacancyRepo.save(vacancy);

    return {
      message: 'Vacante creada',
      data: saved,
    };
  }

  async findAll() {
    const vacancies = await this.vacancyRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'Listado de vacantes',
      data: vacancies,
    };
  }

  async close(id: number) {
    const vacancy = await this.vacancyRepo.findOne({
      where: { id },
    });

    if (!vacancy) {
      throw new Error('Vacante no encontrada');
    }

    vacancy.isActive = false;
    await this.vacancyRepo.save(vacancy);

    return {
      message: 'Vacante cerrada',
    };
  }
}
