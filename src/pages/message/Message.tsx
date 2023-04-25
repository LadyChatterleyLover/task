import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { LoginUser } from '../../api/modules/user/types'

const socket = io('http://localhost:8888', {
  path: '/socket',
  transports: ['websocket'],
  secure: true,
  query: {
    authorization: localStorage.getItem('task-token')
  }
})

interface Message {
  id: number
  user: LoginUser['user']
  content: string
}

const Message = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)

  useEffect(() => {
    socket.on('enter', (data) => {
      setMessages(data.messages)
      console.log('连接成功', data)
    })
    socket.on('leave', () => {
      setMessages([])
      console.log('退出连接')
    })
    socket.on('message', (data) => {
      console.log('data', data)
      setMessages([...data])
    })
  }, [])

  const handleSendMessage = () => {
    socket.emit('message', message)
    setMessage('')
  }

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li
            key={index}
            style={{
              textAlign: user.id === message.user.id ? 'left' : 'right'
            }}
          >
            {message.content}
          </li>
        ))}
      </ul>
      <Input
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
        }}
      />
      <Button onClick={handleSendMessage} type="primary">
        Send
      </Button>
    </div>
  )
}

export default Message
