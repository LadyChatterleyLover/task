import { Configuration, App } from '@midwayjs/core'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import * as info from '@midwayjs/info'
import * as orm from '@midwayjs/typeorm'
import * as crossDomain from '@midwayjs/cross-domain'
import * as jwt from '@midwayjs/jwt'
import * as dot from 'dotenv'
import { join } from 'path'
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware'
import { SecurityMiddleware } from './middleware/security.middleware'

dot.config()

@Configuration({
  imports: [
    koa,
    validate,
    orm,
    crossDomain,
    jwt,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, SecurityMiddleware])
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
