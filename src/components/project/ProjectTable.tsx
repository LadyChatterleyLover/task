import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Table, Tag, TableColumnProps, message, Modal, Pagination, Avatar, Empty } from 'antd'
import dayjs from 'dayjs'
import { ProjectItem } from '../../types/project'
import { TaskItem } from '../../types/task'
import TaskSetting from './TaskSetting'
import api from '../../api'
import { LoginUser } from '../../api/modules/user/types'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { useRandomColor } from '../../hooks/useRandomColor'
import UpdateTask from './UpdateTask'

const { confirm } = Modal

interface Props {
  keyword: string
  project: ProjectItem
}

const ProjectTable = forwardRef((props: Props, ref) => {
  const { keyword, project } = props
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const [currentTime, setCurrentTime] = useState(dayjs())
  const [taskList, setTaskList] = useState<TaskItem[]>([])
  const [currentTask, setCurrentTask] = useState<TaskItem>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [size, setSize] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [visible, setVisible] = useState(false)

  const getTaskDetail = () => {
    api.task
      .getTaskDetail({
        projectId: project.id,
        userId: user.id,
        current: currentPage,
        size,
        keyword
      })
      .then((res) => {
        if (res.code === 200) {
          res.data.map((item) => {
            item.users.map((user) => {
              user.bgColor = useRandomColor()
            })
          })
          setTaskList(res.data)
          setTotal(res.total as number)
        }
      })
  }

  const changeCurrent = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setSize(pageSize)
  }

  const changeSize = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setSize(pageSize)
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

  const clickItMenu = (key: string, task: TaskItem) => {
    if (key.includes('#')) {
      api.task
        .updateTask(task.id, {
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
    } else if (key === 'del') {
      confirm({
        title: '删除任务',
        icon: <ExclamationCircleFilled />,
        content: `你确定要删除任务 【${task.name}】 吗?`,
        okType: 'danger',
        onOk() {
          api.task.deleteTask(task.id).then((res) => {
            if (res.code === 200) {
              message.success(res.msg)
              getTaskDetail()
            } else {
              message.error(res.msg)
            }
          })
        },
        onCancel() {
          message.info('已取消删除')
        }
      })
    } else {
      api.task
        .updateTask(task.id, {
          status: +key
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
    return `bg-[${rocord.bgColor}] cursor-pointer`
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
        <div className="flex items-center">
          <div className="w-[45%] flex justify-end">
            <TaskSetting task={record} clickItMenu={clickItMenu} />
          </div>
          <div className="ml-2 flex-1 flex justify-start">{record.name}</div>
        </div>
      )
    },
    {
      title: '任务描述',
      dataIndex: 'desc',
      key: 'desc',
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
      render: (_, rocord) => {
        return (
          <Avatar.Group>
            {rocord &&
              rocord.users &&
              rocord.users.map((item) => {
                return (
                  <Avatar style={{ background: item.bgColor }} key={item.id}>
                    {item.username.slice(0, 2)}
                  </Avatar>
                )
              })}
          </Avatar.Group>
        )
      }
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

  const onRow = (record: TaskItem) => {
    return {
      onClick: (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setCurrentTask(record)
        setVisible(true)
      }
    }
  }

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
  }, [project, currentPage, size])

  useImperativeHandle(ref, () => ({
    getTaskDetail
  }))

  return taskList.length ? (
    <div className="h-full w-full">
      <Table
        rowKey="id"
        dataSource={taskList}
        columns={columns}
        rowClassName={rowClassName}
        pagination={false}
        onRow={onRow}
      ></Table>
      <div className="flex justify-end mt-5">
        <Pagination
          total={total}
          defaultPageSize={size}
          pageSizeOptions={[10, 20, 50, 100]}
          onChange={changeCurrent}
          onShowSizeChange={changeSize}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
        />
      </div>
      <UpdateTask
        project={project}
        task={currentTask as TaskItem}
        visible={visible}
        setVisible={setVisible}
        getTaskDetail={getTaskDetail}
      />
    </div>
  ) : (
    <div className="flex items-center justify-center h-full w-full">
      <Empty />
    </div>
  )
})

export default ProjectTable
