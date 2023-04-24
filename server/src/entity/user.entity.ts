import { Task } from './task.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { File } from './file.entity'
import { Project } from './project.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Exclude()
  @Column()
  password: string

  @Column({ default: '' })
  email: string

  @Column({ default: '' })
  nickname: string

  @Column({ default: '' })
  avatar: string

  @Column({ default: '' })
  role: string

  @ManyToMany(() => Task, task => task.users)
  tasks: Task[]

  @ManyToMany(() => Project, project => project.users)
  project: Task[]

  @OneToMany(() => File, file => file.user)
  file: File[]

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
