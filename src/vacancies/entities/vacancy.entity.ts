import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Application, (application) => application.vacancy)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;
}
