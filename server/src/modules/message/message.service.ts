import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from './entities/message.entity'
import { Repository } from 'typeorm'
import { User } from 'src/modules/user/entities/user.entity'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendMessage(content: string, id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    })
    await this.messageRepository.save({
      content,
      user,
    })
  }

  async getMessageList() {
    return await this.messageRepository.find({
      relations: ['user'],
    })
  }
}
