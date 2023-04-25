import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:8888', {
  path: '/socket',
  transports: ['websocket'],
  secure: true,
  query: {
    authorization: localStorage.getItem('task-token')
  }
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
    socket.on('enter', (data) => {
      setId(data.id)
      console.log('连接成功', data)
    })
    socket.on('leave', () => {
      setId('')
      setMessages([])
      console.log('退出连接')
    })
    socket.on('message', (data) => {
      console.log('data', data)
      // setMessages([...data])
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
