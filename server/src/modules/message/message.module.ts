import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { MessageGateway } from './message.gateway'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from './entities/message.entity'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  providers: [MessageGateway, MessageService, JwtService],
})
export class MessageModule {}
