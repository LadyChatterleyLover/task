import React, { useState, useEffect } from 'react'
import { Table, Tag, TableColumnProps, message } from 'antd'
import dayjs from 'dayjs'
import { ProjectItem } from '../../types/project'
import { TaskItem } from '../../types/task'
import Setting from './Setting'
import api from '../../api'
import { LoginUser } from '../../api/modules/user/types'

interface Props {
  project: ProjectItem
}

const ProjectTable = (props: Props) => {
  const { project } = props
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const [currentTime, setCurrentTime] = useState(dayjs())
  const [taskList, setTaskList] = useState<TaskItem[]>([])

  const getTaskDetail = () => {
    api.task
      .getTaskDetail({
        projectId: project.id,
        userId: user.id
      })
      .then((res) => {
        if (res.code === 200) {
          setTaskList(res.data)
        }
        console.log('res', res.data)
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
          <div>
            {days !== 0 ? days + 'd,' : null}
            {hours}h
          </div>
        )
      }
      return (
        <Tag color="orange">
          {days !== 0 ? days + 'd,' : null}
          {hours < 10 ? '0' + hours : hours}:{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
        </Tag>
      )
    } else {
      if (days === -1) {
        return (
          <Tag color="red">
            {Math.abs(hours) < 10 ? '-0' + Math.abs(hours) : hours}:{Math.abs(minutes) < 10 ? '0' + Math.abs(minutes) : Math.abs(minutes)}:
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

  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="#ff7070">待处理</Tag>
      case 1:
        return <Tag color="#fc984b">进行中</Tag>
      case 2:
        return <Tag color="#2f99ec">待测试</Tag>
      case 3:
        return <Tag color="#0bc037">已完成</Tag>
      case 4:
        return <Tag color="gold">已取消</Tag>
      default:
        break
    }
  }

  const clickItMenu = (key: string, id: number) => {
    if (key.includes('#')) {
      api.task
        .updateTask(id, {
          bgColor: key
        })
        .then((res) => {
          if (res.code === 200) {
            message.success(res.msg)
            getTaskDetail()
          } else {
            message.error(res.msg)
          }
        })
    }
  }

  const rowClassName = (rocord: TaskItem) => {
    return `bg-[${rocord.bgColor}]`
  }

  const columns: TableColumnProps<TaskItem>[] = [
    {
      title: '#',
      dataIndex: 'key',
      align: 'center',
      render: (_, r, index) => <div>{index + 1}</div>
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <Setting task={record} clickItMenu={clickItMenu} />
          <div className="ml-2">{record.name}</div>
        </div>
      )
    },
    {
      title: '列表',
      dataIndex: 'project',
      key: 'project',
      align: 'center',
      render: () => <div>{project.name}</div>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => renderStatus(record.status)
    },
    {
      title: '优先级',
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      sorter: true,
      render: (text) => {
        if (text === 'P1') {
          return <Tag color="red">{text}</Tag>
        }
        if (text === 'P2') {
          return <Tag color="blue">{text}</Tag>
        }

        if (text === 'P3') {
          return <Tag color="cyan">{text}</Tag>
        }
      }
    },
    {
      title: '负责人',
      dataIndex: 'users',
      key: 'users',
      align: 'center',
      render: (_, r, index) => (
        <div>
          {project.tasks[index].users.map((item) => (
            <span key={item.id} className="mr-1">
              {item.username}
            </span>
          ))}
        </div>
      )
    },
    {
      title: '到期时间',
      dataIndex: 'endTime',
      key: 'endTime',
      align: 'center',
      render: (_, record) => {
        return record.diffTime
      }
    }
  ]
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (project) {
      taskList.map((item) => {
        item.diffTime = diffTime(item.endTime)
      })
      setTaskList([...taskList])
    }
  }, [currentTime, project])

  useEffect(() => {
    if (project) {
      getTaskDetail()
    }
  }, [project])

  return taskList.length ? <Table rowKey="id" dataSource={taskList} columns={columns} rowClassName={rowClassName}></Table> : null
}

export default ProjectTable
