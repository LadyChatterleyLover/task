import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MessageService } from './message.service'

@WebSocketGateway({
  path: '/socket',
  allowEIO3: true,
  cors: {
    origin: /.*/,
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
  ) {}

  private logger: Logger = new Logger('ChatGateway')
  @WebSocketServer() private ws: Server

  afterInit() {
    this.logger.log('websocket init ...')
  }

  async getUser(client: Socket) {
    const token = (client.handshake.query.authorization as string).replace(
      'Bearer ',
      '',
    )
    const decode: any = await this.jwtService.decode(token, { complete: true })
    const user = decode.payload
    delete user.password
    return user
  }

  async handleConnection(client: Socket) {
    const user = await this.getUser(client)
    const messages = await this.messageService.getMessageList()
    this.ws.emit('enter', {
      user,
      messages,
    })
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getUser(client)
    this.ws.emit('leave', {
      user,
    })
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: any) {
    const user = await this.getUser(client)
    await this.messageService.sendMessage(data, user.id)
    const messages = await this.messageService.getMessageList()
    this.ws.emit('message', messages)
  }
}
