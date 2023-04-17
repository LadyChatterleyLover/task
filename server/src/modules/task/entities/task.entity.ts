import { Project } from 'src/modules/project/entities/project.entity'
import { User } from 'src/modules/user/entities/user.entity'

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

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project

  @Column()
  desc: string

  @Column()
  startTime: string

  @Column()
  endTime: string

  @Column({ default: 'P1' })
  level: string

  @Column({ default: false })
  completed: boolean

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable({ name: 'tasks_users' })
  users: User[]

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
