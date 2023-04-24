import { Inject, Provide } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Task } from '../entity/task.entity'
import { Repository } from 'typeorm'
import { User } from '../entity/user.entity'
import { Project } from '../entity/project.entity'
import { UserService } from './user.service'

@Provide()
export class TaskService {
  @InjectEntityModel(Task)
  taskRepository: Repository<Task>

  @InjectEntityModel(User)
  userRepository: Repository<User>

  @InjectEntityModel(Project)
  projectRepository: Repository<Project>

  @Inject()
  userService: UserService

  async create(taskDto) {
    const { name, users: userIds = [], project: projectId } = taskDto
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

  async findAll(current: number, size: number, keyword = '') {
    const res = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'users')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.name LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('task.id LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('task.desc LIKE :keyword', { keyword: `%${keyword}%` })
      .skip(current ? (current - 1) * size : 0)
      .take(size ? size : 0)
      .getManyAndCount()
    res[0].map(item => {
      item.users.map(user => {
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

  async findOne(
    projectId: number,
    userId: number,
    current = 1,
    size = 5,
    keyword = ''
  ) {
    const data = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.users', 'users')
      .where('task.project = :projectId', { projectId })
      .andWhere('task.name LIKE :keyword')
      .setParameter('keyword', `%${keyword}%`)
      .skip((current - 1) * size)
      .take(size)
      .getManyAndCount()
    return {
      code: 200,
      msg: '查询成功',
      data: data[0],
      total: data[1],
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
    if (updateTaskDto.users && updateTaskDto.users.length) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .whereInIds(updateTaskDto.users)
        .getMany()
      newData.users = users
    }
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
