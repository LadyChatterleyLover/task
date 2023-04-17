import { Task } from 'src/modules/task/entities/task.entity'
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
import { File } from 'src/modules/file/entities/file.entity'

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

  @ManyToMany(() => Task, (task) => task.users)
  tasks: Task[]

  @OneToMany(() => File, (file) => file.user_id)
  file: File[]

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
