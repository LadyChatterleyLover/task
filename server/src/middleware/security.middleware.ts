import { Config, Inject, Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'
import { JwtService } from '@midwayjs/jwt'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entity/user.entity'
import { httpError } from '@midwayjs/core'

/**
 * 安全验证
 */
@Middleware()
export class SecurityMiddleware {
  @Inject()
  jwtUtil: JwtService

  @InjectEntityModel(User)
  userRepository: Repository<User>

  @Config('app.security')
  securityConfig

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError('缺少凭证')
      }
      const parts = ctx.get('authorization').trim().split(' ')
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError('无效的凭证')
      }
      const [scheme, token] = parts
      if (!/^Bearer$/i.test(scheme)) {
        throw new httpError.UnauthorizedError('缺少Bearer')
      }
      const jwt = await this.jwtUtil.verify(token, { complete: true })
      const payload = jwt['payload']
      const user = await this.userRepository.findOne({
        where: {
          username: payload.username,
          id: payload.id,
        },
      })
      ctx.setAttr('currentUser', user)
      return next()
    }
  }

  public match(ctx: Context): boolean {
    const ignore = ctx.path.indexOf('/user') !== -1
    return !ignore
  }

  public static getName(): string {
    return 'SECURITY'
  }
}
