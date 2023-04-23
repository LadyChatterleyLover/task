import React, { ReactNode } from 'react'
import { Dropdown, MenuProps, Modal, message } from 'antd'
import { TaskItem } from '../../types/task'
import { CheckOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import api from '../../api'

interface Props {
  task: TaskItem
  getTaskDetail: () => void
  children: ReactNode
}

const { confirm } = Modal

const Setting = (props: Props) => {
  const { task, getTaskDetail, children } = props
  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ border: '1px solid', borderColor: task.status === 0 ? '#84c56a' : '#eee' }}
          >
            {task.status === 0 ? <CheckOutlined size={12} style={{ color: '#84c56a' }} /> : null}
          </div>
          <div className="m-[6px]">待处理</div>
        </div>
      )
    },
    {
      key: '1',
      label: (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ border: '1px solid', borderColor: task.status === 1 ? '#84c56a' : '#eee' }}
          >
            {task.status === 1 ? <CheckOutlined style={{ color: '#84c56a' }} /> : null}
          </div>
          <div className="m-[6px]">进行中</div>
        </div>
      )
    },
    {
      key: '2',
      label: (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ border: '1px solid', borderColor: task.status === 2 ? '#84c56a' : '#eee' }}
          >
            {task.status === 2 ? <CheckOutlined style={{ color: '#84c56a' }} /> : null}
          </div>
          <div className="m-[6px]">待测试</div>
        </div>
      )
    },
    {
      key: '3',
      label: (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ border: '1px solid', borderColor: task.status === 3 ? '#84c56a' : '#eee' }}
          >
            {task.status === 3 ? <CheckOutlined style={{ color: '#84c56a' }} /> : null}
          </div>
          <div className="m-[6px]">已完成</div>
        </div>
      )
    },
    {
      key: '4',
      label: (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ border: '1px solid', borderColor: task.status === 4 ? '#84c56a' : '#eee' }}
          >
            {task.status === 4 ? <CheckOutlined style={{ color: '#84c56a' }} /> : null}
          </div>
          <div className="m-[6px]">已取消</div>
        </div>
      )
    },
    {
      type: 'divider'
    },
    {
      key: 'del',
      label: (
        <div className="flex items-center">
          <DeleteOutlined />
          <div className="ml-3">删除</div>
        </div>
      )
    },
    {
      type: 'divider'
    },
    {
      key: '#fff',
      label: (
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white"></div>
          <div className="ml-2">默认</div>
        </div>
      )
    },
    {
      key: '#fffae6',
      label: (
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#fffae6]"></div>
          <div className="ml-2">黄色</div>
        </div>
      )
    },
    {
      key: '#e5f5ff',
      label: (
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#e5f5ff]"></div>
          <div className="ml-2">蓝色</div>
        </div>
      )
    },
    {
      key: '#ecffe5',
      label: (
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#ecffe5]"></div>
          <div className="ml-2">绿色</div>
        </div>
      )
    },
    {
      key: '#ffeaee',
      label: (
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#ffeaee]"></div>
          <div className="ml-2">粉色</div>
        </div>
      )
    },
    {
      key: '#f6ecff',
      label: (
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#f6ecff]"></div>
          <div className="ml-2">紫色</div>
        </div>
      )
    },
    {
      key: '#f3f3f3',
      label: (
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#f3f3f3]"></div>
          <div className="ml-2">灰色</div>
        </div>
      )
    }
  ]

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

  const onClick: MenuProps['onClick'] = ({ key }) => {
    clickItMenu(key, task)
  }

  return (
    <Dropdown menu={{ items, onClick }} placement="top" arrow trigger={['click']}>
      {children}
    </Dropdown>
  )
}

export default Setting
