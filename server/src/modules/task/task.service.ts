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

  async findAll(current: number, size: number, keyword: string) {
    const res = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'users')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.name LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('task.id LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('task.desc LIKE :keyword', { keyword: `%${keyword}%` })
      .skip((current - 1) * size)
      .take(size)
      .getManyAndCount()
    res[0].map((item) => {
      item.users.map((user) => {
        delete user.password
      })
    })
    return {
      code: 200,
      msg: '获取成功',
      data: res[0],
      total: res[1],
    }
  }

  async findOne(projectId: number, userId: number) {
    const data = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.users', 'users')
      .where('project.id = :projectId', { projectId })
      .andWhere('users.id = :userId', { userId })
      .getMany()
    return {
      code: 200,
      msg: '查询成功',
      data,
    }
  }

  async findById(id: number) {
    const data = await this.taskRepository.findOne({
      where: {
        id,
      },
    })
    return {
      code: 200,
      msg: '查询成功',
      data,
    }
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

  async search(keyword: string) {
    const data = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.name LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('task.id LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('task.desc LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany()
    return {
      code: 200,
      msg: '查询成功',
      data,
    }
  }
}
