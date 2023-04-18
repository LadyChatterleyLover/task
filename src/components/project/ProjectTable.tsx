import React, { useState, useEffect } from 'react'
import { Table, Tag, TableColumnProps } from 'antd'
import cloneDeep from 'lodash-es/cloneDeep'
import dayjs from 'dayjs'
import { ProjectItem } from '../../types/project'
import { TaskItem } from '../../types/task'

interface Props {
  project: ProjectItem
}

const ProjectTable = (props: Props) => {
  const { project: propProject } = props
  const [project, setProject] = useState<ProjectItem>(cloneDeep(propProject))
  const [currentTime, setCurrentTime] = useState(dayjs())

  const diffTime = (time: string) => {
    const endTime = dayjs(time)
    const diff = endTime.diff(currentTime, 'millisecond')
    const days = Math.floor(diff / 86400000) // 获取天数
    const hours = Math.floor((diff % 86400000) / 3600000) // 获取小时数
    const minutes = Math.floor((diff % 3600000) / 60000) // 获取分钟数
    const seconds = Math.floor((diff % 60000) / 1000) // 获取秒数
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
            {hours}:{minutes}:{seconds}
          </Tag>
        )
      }
      return (
        <Tag color="red">
          {days !== 0 ? days + 'd' : null},{hours}h
        </Tag>
      )
    }
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
      align: 'center'
    },
    {
      title: '列表',
      dataIndex: 'project',
      key: 'project',
      align: 'center',
      render: () => <div>{project.name}</div>
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
      render: (_, record: TaskItem) => (
        <div>
          {record.users.map((item) => (
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
    if (propProject) {
      const cloneProject = cloneDeep(propProject)
      cloneProject.tasks.map((item) => {
        item.diffTime = diffTime(item.endTime)
      })
      setProject({ ...cloneProject })
    }
  }, [currentTime, propProject])

  return project ? <Table rowKey="id" dataSource={project.tasks} columns={columns}></Table> : null
}

export default ProjectTable
