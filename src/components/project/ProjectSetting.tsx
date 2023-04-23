import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Modal, Form, MenuProps, Input, message, Select } from 'antd'
import { ProjectItem } from '../../types/project'
import api from '../../api'
import { LoginUser } from '../../api/modules/user/types'

interface Props {
  project: ProjectItem
  getProject: (val: string) => void
}

const ProjectSetting = (props: Props) => {
  const { project, getProject } = props
  const navigate = useNavigate()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '项目设置'
    },
    {
      key: '2',
      label: '工作流设置'
    },
    {
      type: 'divider'
    },
    {
      key: '3',
      label: '成员管理'
    },
    {
      key: '4',
      label: '邀请链接'
    },
    {
      type: 'divider'
    },
    {
      key: '5',
      label: '项目动态'
    },
    {
      key: '6',
      label: '已归档项目'
    },
    {
      key: '7',
      label: '已删除项目'
    },
    {
      type: 'divider'
    },
    {
      key: '8',
      label: '移交项目'
    },
    {
      key: '9',
      label: '归档项目'
    },
    {
      key: '10',
      label: '删除项目'
    }
  ]
  const [settingForm] = Form.useForm()
  const [userForm] = Form.useForm()

  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)

  const [userList, setUserList] = useState<LoginUser['user'][]>([])
  const [settingVisible, setSettingVisible] = useState(false)
  const [userVisible, setUserVisible] = useState(false)

  const clickMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      setSettingVisible(true)
    }
    if (key === '3') {
      setUserVisible(true)
      getUserList()
    }
  }

  const settingConfirm = () => {
    settingForm
      .validateFields()
      .then(() => {
        const name = settingForm.getFieldsValue().name
        api.project
          .updateProject(project.id, {
            name
          })
          .then((res) => {
            if (res.code === 200) {
              message.success(res.msg)
              getProject(String(project.id))
              setSettingVisible(false)
              navigate(`/project?id=${project.id}&name=${name}`)
            } else {
              message.error(res.msg)
            }
          })
      })
      .catch(() => {
        message.error('表单填写有误,请检查')
      })
  }

  const getUserList = () => {
    api.user.userList().then((res) => {
      if (res.code === 200) {
        setUserList(res.data)
      }
    })
  }

  const userConfirm = () => {
    const users = userForm.getFieldsValue().users
    api.project
      .updateProject(project.id, {
        users
      })
      .then((res) => {
        if (res.code === 200) {
          message.success(res.msg)
          setUserVisible(false)
          getProject(String(project.id))
        } else {
          message.error(res.msg)
        }
      })
  }

  return (
    <>
      <Dropdown menu={{ items, onClick: clickMenu }} trigger={['click']} placement="bottom" arrow>
        <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
          <MoreOutlined style={{ transform: 'rotate(90deg)' }} />
        </Avatar>
      </Dropdown>
      <Modal
        title="项目设置"
        open={settingVisible}
        destroyOnClose
        maskClosable={false}
        onOk={settingConfirm}
        onCancel={() => setSettingVisible(false)}
      >
        <Form form={settingForm} initialValues={{ name: project.name }}>
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: '项目名称不能为空' }]}
          >
            <Input placeholder="请输入项目名称" allowClear />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="成员管理"
        open={userVisible}
        destroyOnClose
        onOk={userConfirm}
        onCancel={() => setUserVisible(false)}
      >
        <Form form={userForm} initialValues={{ users: [user.id] }}>
          <Form.Item name="users">
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
        </Form>
      </Modal>
    </>
  )
}

export default ProjectSetting
