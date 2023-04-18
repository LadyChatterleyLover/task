import React, { useEffect, useState } from 'react'
import { Avatar, DatePicker, Form, Input, Modal, Select, Tooltip, message } from 'antd'
import { ProjectItem } from '../../types/project'
import { LoginUser } from '../../api/modules/user/types'
import { MoreOutlined, PlusOutlined, SearchOutlined, WechatOutlined } from '@ant-design/icons'
import api from '../../api'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface Props {
  project: ProjectItem
  getProject: (val: string) => void
}

const ProjectHeader = (props: Props) => {
  const { project, getProject } = props
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: '请选择时间' }]
  }
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [userList, setUserList] = useState<LoginUser['user'][]>([])

  const getUserList = () => {
    api.user.userList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data)
      }
    })
  }

  const addTask = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue()
        const startTime = dayjs(values.time[0]).format('YYYY-MM-MM HH:mm:ss')
        const endTime = dayjs(values.time[1]).format('YYYY-MM-MM HH:mm:ss')
        api.task
          .addTask({
            ...values,
            startTime,
            endTime,
            project: project.id
          })
          .then((res) => {
            if (res.code === 200) {
              message.success(res.msg)
              getProject(String(project.id))
              setVisible(false)
            } else {
              message.error(res.msg)
            }
          })
          .catch(() => {
            setVisible(false)
          })
      })
      .catch(() => {
        message.error('表单填写有误,请检查')
      })
  }

  useEffect(() => {
    getUserList()
  }, [])

  return (
    <>
      {project ? (
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">{project.name}</div>
          <div className="flex items-center">
            <div className="mr-3 cursor-pointer">
              <Avatar style={{ background: '#028955' }}>{user.username.slice(0, 2)}</Avatar>
            </div>
            <div className="mr-3 cursor-pointer" onClick={() => setVisible(true)}>
              <Tooltip title="添加任务">
                <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
                  <PlusOutlined />
                </Avatar>
              </Tooltip>
            </div>
            <div className="mr-3 cursor-pointer">
              <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
                <SearchOutlined />
              </Avatar>
            </div>
            <div className="mr-3 cursor-pointer">
              <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
                <WechatOutlined />
              </Avatar>
            </div>
            <div className="mr-3 cursor-pointer">
              <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
                <MoreOutlined style={{ transform: 'rotate(90deg)' }} />
              </Avatar>
            </div>
          </div>
        </div>
      ) : null}

      <Modal open={visible} title="添加任务" destroyOnClose onOk={addTask} onCancel={() => setVisible(false)}>
        <Form form={form} initialValues={{ users: [user.id] }}>
          <Form.Item name="name" rules={[{ required: true, message: '任务名称不能为空' }]}>
            <Input placeholder="任务名称" allowClear />
          </Form.Item>
          <Form.Item name="desc" rules={[{ required: true, message: '任务描述不能为空' }]}>
            <Input placeholder="任务描述" allowClear />
          </Form.Item>
          {userList.length ? (
            <Form.Item name="users" rules={[{ required: true, message: '任务描述不能为空' }]}>
              <Select placeholder="项目负责人" showSearch allowClear mode="multiple">
                {userList.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id} disabled={item.id === user.id}>
                      {item.username}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          ) : null}
          <Form.Item name="level" rules={[{ required: true, message: '优先级不能为空' }]}>
            <Select placeholder="优先级">
              <Select.Option value="P1">P1</Select.Option>
              <Select.Option value="P2">P2</Select.Option>
              <Select.Option value="P3">P3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="time" {...rangeConfig}>
            <RangePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['开始时间', '结束时间']} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ProjectHeader
