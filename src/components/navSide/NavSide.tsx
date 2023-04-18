import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarOutlined, FileOutlined, HomeOutlined, MessageOutlined } from '@ant-design/icons'
import PorjectList from './PorjectList'
import UserInfo from './UserInfo'

interface Nav {
  name: string
  path: string
  icon: JSX.Element
}

interface ProjectRef {
  setCurrentProject: (val: number) => void
}

const NavSide = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [currentPath, setCurrentPath] = useState('')
  const projectRef = useRef<ProjectRef>()

  const navList: Nav[] = [
    {
      name: '仪表盘',
      path: '/',
      icon: <HomeOutlined />
    },
    {
      name: '日历',
      path: '/calendar',
      icon: <CalendarOutlined />
    },
    {
      name: '消息',
      path: '/message',
      icon: <MessageOutlined />
    },
    {
      name: '文件',
      path: '/file',
      icon: <FileOutlined />
    }
  ]

  const clickNav = (item: Nav) => {
    setCurrentPath(item.path)
    navigate(item.path)
    projectRef.current?.setCurrentProject(-1)
  }

  const setPath = (val: string) => {
    setCurrentPath(val)
  }

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [])

  return (
    <div className="p-5">
      <UserInfo />
      <div className="my-5">
        {navList.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-center p-3 mb-3 cursor-pointer"
              style={{ background: currentPath === item.path ? '#fff' : 'inherit' }}
              onClick={() => clickNav(item)}
            >
              <div className="flex items-center text-[#d9d9da] text-lg">{item.icon}</div>
              <div className="ml-4 text-[#6b6e72]">{item.name}</div>
            </div>
          )
        })}
      </div>
      <PorjectList ref={projectRef} setPath={setPath} />
    </div>
  )
}

export default NavSide
