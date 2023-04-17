import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './entities/task.entity'
import { User } from '../user/entities/user.entity'
import { Project } from '../project/entities/project.entity'
import { UserService } from '../user/user.service'
import { AuthService } from '../auth/auth.service'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Project])],
  controllers: [TaskController],
  providers: [TaskService, UserService, AuthService, JwtService],
})
export class TaskModule {}
