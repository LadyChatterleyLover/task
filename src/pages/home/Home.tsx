import React from 'react'
import { useState, useEffect } from 'react'
import { LoginUser } from '../../api/modules/user/types'
import { FileTextOutlined } from '@ant-design/icons'

const Home = () => {
  const [userInfo, setUserInfo] = useState<LoginUser['user']>()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('task-user') as string) as LoginUser['user']
    setUserInfo(user)
  }, [])
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="font-bold text-2xl">欢迎您，{userInfo?.username}</div>
      <div className="text-sm text-[#888] my-5">以下是你当前的任务统计数据</div>
      <div className="flex items-center w-[660px]">
        <div className="bg-[#6f9ef6] mr-6 flex flex-col justify-center cursor-pointer flex-1 px-6 py-4 rounded-lg">
          <div className="mb-3 text-white">今日到期</div>
          <div className="flex items-center justify-between text-[#fff]">
            <div className="text-2xl">0</div>
            <div>{<FileTextOutlined />}</div>
          </div>
        </div>
        <div className="bg-[#fa8e8c] mr-6 flex flex-col justify-center cursor-pointer flex-1 px-6 py-4 rounded-lg">
          <div className="mb-3 text-white">超期任务</div>
          <div className="flex items-center justify-between text-[#fff]">
            <div className="text-2xl">0</div>
            <div>{<FileTextOutlined />}</div>
          </div>
        </div>
        <div className="bg-[#98de6e] mr-6 flex flex-col justify-center cursor-pointer flex-1 px-6 py-4 rounded-lg ">
          <div className="mb-3 text-white">待完成任务</div>
          <div className="flex items-center justify-between  text-[#fff]">
            <div className="text-2xl">0</div>
            <div>{<FileTextOutlined />}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
