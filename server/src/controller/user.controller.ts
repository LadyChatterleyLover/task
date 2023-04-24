import { Inject, Controller, Get, Post, Body } from '@midwayjs/core'
import { Context } from '@midwayjs/koa'
import { UserService } from '../service/user.service'

@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context

  @Inject()
  userService: UserService

  @Post('/register')
  async register(@Body() userDto) {
    return await this.userService.register(userDto)
  }

  @Post('/login')
  async login(@Body() userDto) {
    return await this.userService.login(userDto)
  }

  @Get('/')
  async find() {
    return await this.userService.find()
  }

  @Post('/')
  async findByIds(@Body() ids) {
    return await this.userService.findByIds(ids)
  }

  @Post('/task')
  async findTask(@Body() params: { id: number }) {
    return this.userService.findTask(params.id)
  }

  @Post('/file')
  async findFile(@Body() params: { id: number }) {
    return this.userService.findFile(params.id)
  }
}
