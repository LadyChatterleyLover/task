import { User } from './user.entity'
import { Task } from './task.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm'

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToMany(() => Task, task => task.project)
  tasks: Task[]

  @ManyToMany(() => User, user => user.project)
  @JoinTable({ name: 'projects_users' })
  users: User[]

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
