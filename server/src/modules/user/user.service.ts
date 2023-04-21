import { Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { createPassword } from 'src/utils/crypto'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async register(userDto: UserDto) {
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
      password: createPassword(password),
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

  async login(userDto: UserDto) {
    const authResult = await this.authService.validateUser(
      userDto.username,
      userDto.password,
    )
    switch (authResult.code) {
      case 1:
        return this.authService.certificate(authResult.user)
      case 2:
        return {
          code: 500,
          msg: `账号或密码不正确`,
        }
      default:
        return {
          code: 500,
          msg: '该账号没有注册',
        }
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
      .whereInIds(ids.map((item) => +item))
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
