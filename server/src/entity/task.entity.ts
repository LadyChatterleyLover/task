import { Project } from './project.entity'
import { User } from './user.entity'

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Project, project => project.tasks)
  project: Project

  @Column({ default: 0 })
  status: number

  @Column()
  desc: string

  @Column()
  startTime: string

  @Column()
  endTime: string

  @Column({ default: '' })
  bgColor: string

  @Column({ default: 'P1' })
  level: string

  @ManyToMany(() => User, user => user.tasks)
  @JoinTable({ name: 'tasks_users' })
  users: User[]

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
