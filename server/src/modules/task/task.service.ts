import { UserService } from './../user/user.service'
import { Injectable } from '@nestjs/common'
import { TaskDto } from './dto/task.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './entities/task.entity'
import { Repository } from 'typeorm'
import { Project } from '../project/entities/project.entity'

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private readonly userService: UserService,
  ) {}

  async create(taskDto: TaskDto) {
    const { name, users: userIds, project: projectId } = taskDto
    const existTask = await this.taskRepository.findOne({
      where: {
        name,
      },
    })
    if (existTask) {
      return {
        code: 500,
        msg: '任务已存在',
      }
    }
    const project = await this.projectRepository.findOne({
      where: {
        id: +projectId,
      },
    })
    const users = await this.userService.findByIds(userIds)
    const res = await this.taskRepository.save({
      ...taskDto,
      project,
      users,
    })
    if (res) {
      return {
        code: 200,
        msg: '创建成功',
        data: res,
      }
    } else {
      return {
        code: 500,
        msg: '创建失败',
      }
    }
  }

  async findAll() {
    const res = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'users')
      .leftJoinAndSelect('task.project', 'project')
      .getMany()
    res.map((item) => {
      item.users.map((user) => {
        delete user.password
      })
    })
    return {
      code: 200,
      msg: '获取成功',
      data: res,
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} task`
  }

  async update(id: number, updateTaskDto) {
    const data = await this.taskRepository.findOne({
      where: {
        id,
      },
    })
    const newData = Object.assign(data, { ...updateTaskDto })
    const res = await this.taskRepository.save(newData)
    if (res) {
      return {
        code: 200,
        msg: '修改成功',
      }
    } else {
      return {
        code: 500,
        msg: '修改失败',
      }
    }
  }

  async remove(id: number) {
    const data = await this.taskRepository.findOne({
      where: {
        id,
      },
    })
    const res = await this.taskRepository.remove(data)
    if (res) {
      return {
        code: 200,
        msg: '删除成功',
      }
    } else {
      return {
        code: 500,
        msg: '删除失败',
      }
    }
  }
}
