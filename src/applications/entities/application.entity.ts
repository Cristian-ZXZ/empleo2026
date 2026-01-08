import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { ApplicationStatus } from '../../common/enums/aplication.enum';

@Entity('applications')
@Unique(['user', 'vacancy'])
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.applications, { eager: true })
  user: User;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications, {
    eager: true,
  })
  vacancy: Vacancy;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED,
  })
  status: ApplicationStatus;

  @CreateDateColumn()
  appliedAt: Date;
}
