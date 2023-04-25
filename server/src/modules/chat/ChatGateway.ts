import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  users: { [key: string]: string } = {} // 用户列表，用于记录用户ID和昵称的对应关系

  handleConnection(socket: any) {
    console.log('Client connected:', socket.id)
  }

  handleDisconnect(socket: any) {
    console.log('Client disconnected:', socket.id)
    delete this.users[socket.id]
    this.server.emit('users', this.users)
  }

  @SubscribeMessage('join')
  handleJoin(socket: any, nickname: string) {
    console.log('User joined:', socket.id, nickname)
    this.users[socket.id] = nickname
    socket.emit('message', { user: '系统', content: '欢迎加入聊天室！' })
    this.server.emit('users', this.users)
  }

  @SubscribeMessage('message')
  handleMessage(socket: any, message: string) {
    console.log('User message:', socket.id, message)
    const nickname = this.users[socket.id] || '匿名用户'
    this.server.emit('message', { user: nickname, content: message })
  }
}
