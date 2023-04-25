import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigType } from './constant/config'
import { UserModule } from './modules/user/user.module'
import { ProjectModule } from './modules/project/project.module'
import { TaskModule } from './modules/task/task.module'
import { AuthModule } from './modules/auth/auth.module'
import { FileModule } from './modules/file/file.module'
import { ChatGateway } from './modules/chat/ChatGateway'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigType.DB_TYPE),
          host: configService.get(ConfigType.DB_HOST),
          port: configService.get(ConfigType.DB_PORT),
          username: configService.get(ConfigType.DB_USER),
          password: configService.get(ConfigType.DB_PASS),
          database: configService.get(ConfigType.DB_NAME),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        } as TypeOrmModuleOptions),
    }),
    UserModule,
    ProjectModule,
    TaskModule,
    AuthModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
