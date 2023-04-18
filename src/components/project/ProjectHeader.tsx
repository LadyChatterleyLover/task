import React from 'react'
import { Avatar } from 'antd'
import { ProjectItem } from '../../types/project'
import { LoginUser } from '../../api/modules/user/types'
import { MoreOutlined, PlusOutlined, SearchOutlined, WechatOutlined } from '@ant-design/icons'

interface Props {
  project: ProjectItem
}

const ProjectHeader = (props: Props) => {
  const { project } = props
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  return project ? (
    <div className="flex items-center justify-between">
      <div className="font-bold text-3xl">{project.name}</div>
      <div className="flex items-center">
        <div className="mr-3 cursor-pointer">
          <Avatar style={{ background: '#028955' }}>{user.username.slice(0, 2)}</Avatar>
        </div>
        <div className="mr-3 cursor-pointer">
          <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
            <PlusOutlined />
          </Avatar>
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
  ) : null
}

export default ProjectHeader
