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
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  ext: string

  @Column()
  url: string

  @Column({ default: false })
  isDir: boolean

  @Column({ default: null })
  dirId: number

  @ManyToOne(() => User, (user) => user.file)
  @Column()
  user_id: string

  @Column({ default: 0 })
  size: number

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}
