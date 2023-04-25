import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:6379', {
  path: '/socketio',
  transports: ['websocket'],
  secure: true
})

interface Message {
  id: string
  data: string
}

const Message = () => {
  const [message, setMessage] = useState('')
  const [id, setId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('连接成功')
    })
    socket.on('connection', (data: Message) => {
      setId(data.id)
    })
    socket.on('disconnect', () => {
      console.log('退出连接')
    })
    socket.on('data', (data) => {
      setMessages([...data])
    })
  }, [])

  const handleSendMessage = () => {
    socket.emit('data', message)
    setMessage('')
  }

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li
            key={index}
            style={{
              textAlign: id === message.id ? 'left' : 'right'
            }}
          >
            {message.data}
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
