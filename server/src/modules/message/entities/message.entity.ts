import { User } from 'src/modules/user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @ManyToOne(() => User, (user) => user.messages)
  user: User

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
