import { Inject, Provide } from '@midwayjs/core'
import { User } from '../entity/user.entity'
import { Repository } from 'typeorm'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { JwtService } from '@midwayjs/jwt'
import { decrypt, encrypt } from '../utils/bcrypt'

@Provide()
export class UserService {
  @InjectEntityModel(User)
  usersRepository: Repository<User>

  @Inject()
  jwtUtil: JwtService

  async register(userDto) {
    const { username, password } = userDto
    const existUser = await this.usersRepository.findOne({
      where: {
        username,
      },
    })
    if (existUser) {
      return {
        code: 500,
        msg: '用户已存在',
      }
    }
    const res = await this.usersRepository.save({
      username,
      password: encrypt(password),
    })
    if (res) {
      delete res.password
      return {
        code: 200,
        msg: '注册成功',
        data: res,
      }
    } else {
      return {
        code: 500,
        msg: '注册失败',
      }
    }
  }

  async login(userDto) {
    const { username, password } = userDto
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
    })
    if (!user) {
      return {
        code: 500,
        msg: '用户不存在',
      }
    }
    const flag = decrypt(password, user.password)
    if (!flag) {
      return {
        code: 500,
        msg: '密码不正确',
      }
    }
    const token = await this.jwtUtil.sign({ username, id: user.id })
    const currentUser = JSON.parse(JSON.stringify(user))
    delete currentUser.password
    return {
      code: 200,
      msg: '登录成功',
      data: {
        user: currentUser,
        token: 'Bearer ' + token,
      },
    }
  }

  async find() {
    const res = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.createAt',
        'user.updateAt',
      ])
      .getMany()
    return {
      code: 200,
      msg: '获取成功',
      data: res,
    }
  }

  async findByIds(ids: string[]) {
    const res = await this.usersRepository
      .createQueryBuilder('user')
      .whereInIds(ids.map(item => +item))
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.createAt',
        'user.updateAt',
      ])
      .getMany()
    return res
  }

  async findTask(id: number) {
    const res: any = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tasks', 'tasks')
      .where('user.id = :id', { id })
      .getOne()
    return {
      code: 200,
      msg: '获取成功',
      data: res.tasks,
      total: res.tasks.length,
    }
  }

  async findFile(id: number) {
    const res: any = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.file', 'file')
      .leftJoinAndSelect('file.user', 'users')
      .where('user.id = :id', { id })
      .getOne()
    return {
      code: 200,
      msg: '获取成功',
      data: res.file,
      total: res.file.length,
    }
  }
}
