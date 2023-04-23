import React from 'react'
import { useState, useEffect } from 'react'
import { LoginUser } from '../../api/modules/user/types'
import { FileTextOutlined } from '@ant-design/icons'
import api from '../../api'
import { TaskItem } from '../../types/task'
import dayjs from 'dayjs'
import { Tag } from 'antd'
import Task from '../../components/home/Task'

const Home = () => {
  const user = JSON.parse(localStorage.getItem('task-user') as string) as LoginUser['user']

  const [todayTaskList, setTodayTaskList] = useState<TaskItem[]>([])
  const [overTaskList, setOverTaskList] = useState<TaskItem[]>([])
  const [uncompleteList, setUncompleteList] = useState<TaskItem[]>([])
  const [currentTime, setCurrentTime] = useState(dayjs())

  const getTaskList = () => {
    api.user
      .findTask({
        id: user.id
      })
      .then((res) => {
        setTodayTaskList(
          res.data.filter((item) => {
            const diff = dayjs(item.endTime).diff(dayjs().startOf('day'))
            return diff >= 0 && diff < 1000 * 60 * 60 * 24 && item.status !== 3
          })
        )
        setOverTaskList(
          res.data.filter((item) => {
            const diff = dayjs(item.endTime).diff(dayjs().startOf('day'))
            return diff < 0 && item.status !== 3
          })
        )
        setUncompleteList(res.data.filter((item) => item.status !== 3))
      })
  }

  const diffTime = (time: string) => {
    const endTime = dayjs(time)
    const diff = endTime.diff(currentTime, 'millisecond')
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    if (diff > 0) {
      if (days >= 1) {
        return (
          <Tag>
            {days !== 0 ? days + 'd,' : null}
            {hours}h
          </Tag>
        )
      }
      return (
        <Tag color="orange">
          {days !== 0 ? days + 'd,' : null}
          {hours < 10 ? '0' + hours : hours}:{minutes < 10 ? '0' + minutes : minutes}:
          {seconds < 10 ? '0' + seconds : seconds}
        </Tag>
      )
    } else {
      if (days === -1) {
        return (
          <Tag color="red">
            {Math.abs(hours) < 10 ? '-0' + Math.abs(hours) : hours}:
            {Math.abs(minutes) < 10 ? '0' + Math.abs(minutes) : Math.abs(minutes)}:
            {Math.abs(seconds) < 10 ? '0' + Math.abs(seconds) : Math.abs(seconds)}
          </Tag>
        )
      }
      return (
        <Tag color="red">
          {days !== 0 ? days + 'd, ' : null}
          {Math.abs(hours)}h
        </Tag>
      )
    }
  }

  useEffect(() => {
    getTaskList()
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    overTaskList.map((item) => {
      item.diffTime = diffTime(item.endTime)
    })
    uncompleteList.map((item) => {
      item.diffTime = diffTime(item.endTime)
    })
    setOverTaskList([...overTaskList])
    setUncompleteList([...uncompleteList])
  }, [currentTime])
  return (
    <div className="w-full h-full">
      <div className="font-bold text-2xl w-[660px] max-h-[80%] mx-auto py-4 mt-5">
        欢迎您，{user?.username}
      </div>
      <div className="text-sm text-[#888] w-[660px] max-h-[80%] mx-auto py-3 mb-3">
        以下是你当前的任务统计数据
      </div>
      <div className="flex items-center w-[660px] max-h-[80%] mx-auto">
        <div className="bg-[#6f9ef6] mr-6 flex flex-col justify-center cursor-pointer flex-1 px-6 py-4 rounded-lg">
          <div className="mb-3 text-white">今日到期</div>
          <div className="flex items-center justify-between text-[#fff]">
            <div className="text-2xl">{todayTaskList.length}</div>
            <div>{<FileTextOutlined />}</div>
          </div>
        </div>
        <div className="bg-[#fa8e8c] mr-6 flex flex-col justify-center cursor-pointer flex-1 px-6 py-4 rounded-lg">
          <div className="mb-3 text-white">超期任务</div>
          <div className="flex items-center justify-between text-[#fff]">
            <div className="text-2xl">{overTaskList.length}</div>
            <div>{<FileTextOutlined />}</div>
          </div>
        </div>
        <div className="bg-[#98de6e] mr-6 flex flex-col justify-center cursor-pointer flex-1 px-6 py-4 rounded-lg ">
          <div className="mb-3 text-white">待完成任务</div>
          <div className="flex items-center justify-between  text-[#fff]">
            <div className="text-2xl">{uncompleteList.length}</div>
            <div>{<FileTextOutlined />}</div>
          </div>
        </div>
      </div>
      <div className="mt-[60px] w-[660px] max-h-[80%] mx-auto">
        {overTaskList.length ? (
          <div>
            <div className="font-bold text-base">超期任务</div>
            <div className="mt-4">
              <Task taskList={overTaskList} getTaskList={getTaskList}></Task>
            </div>
          </div>
        ) : null}
        {uncompleteList.length ? (
          <div>
            <div className="font-bold text-base mt-5">待完成任务</div>
            <div className="mt-4">
              <Task taskList={uncompleteList} getTaskList={getTaskList}></Task>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Home
