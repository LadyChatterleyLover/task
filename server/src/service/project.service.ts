import { Context, Inject, Provide } from '@midwayjs/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Project } from '../entity/project.entity'
import { Repository } from 'typeorm'
import { User } from '../entity/user.entity'

@Provide()
export class ProjectService {
  @InjectEntityModel(Project)
  projectRepository: Repository<Project>

  @InjectEntityModel(User)
  userRepository: Repository<User>

  @Inject()
  ctx: Context

  async create(projectDto) {
    const { name } = projectDto
    const existProject = await this.projectRepository.findOne({
      where: {
        name,
      },
    })
    if (existProject) {
      return {
        code: 500,
        msg: '项目已存在',
      }
    }
    const user = this.ctx.getAttr('currentUser')

    const project = await this.projectRepository.save({ name, users: [user] })
    if (project) {
      return {
        code: 200,
        msg: '创建成功',
        data: project,
      }
    } else {
      return {
        code: 500,
        msg: '创建失败',
      }
    }
  }

  async findAll() {
    const data = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .leftJoinAndSelect('project.users', 'userList')
      .leftJoinAndSelect('tasks.users', 'users')
      .getMany()
    return {
      code: 200,
      msg: '获取成功',
      data,
    }
  }

  async findOne(id: number) {
    const data = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .leftJoinAndSelect('project.users', 'userList')
      .leftJoinAndSelect('tasks.users', 'users')
      .where('project.id = :id', { id })
      .getMany()
    data.map(item => {
      item.users.map(user => {
        delete user.password
      })
    })
    if (data) {
      return {
        code: 200,
        msg: '获取成功',
        data,
      }
    } else {
      return {
        code: 500,
        msg: '获取失败',
      }
    }
  }

  async update(id: number, updateProjectDto) {
    const data = await this.projectRepository.findOne({
      where: {
        id,
      },
    })
    const newData = Object.assign(data, { ...updateProjectDto })
    if (updateProjectDto.users && updateProjectDto.users.length) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .whereInIds(updateProjectDto.users)
        .getMany()
      newData.users = users
    }
    const res = await this.projectRepository.save(newData)
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
    const data = await this.projectRepository.findOne({
      where: {
        id,
      },
    })
    const res = await this.projectRepository.remove(data)
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
