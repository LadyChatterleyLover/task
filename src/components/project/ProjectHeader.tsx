import React, { useState } from 'react'
import { Avatar, Tooltip } from 'antd'
import { ProjectItem } from '../../types/project'
import { LoginUser } from '../../api/modules/user/types'
import { MoreOutlined, PlusOutlined, SearchOutlined, WechatOutlined } from '@ant-design/icons'
import AddTask from './AddTask'

interface Props {
  project: ProjectItem
  getProject: (val: string) => void
}

const ProjectHeader = (props: Props) => {
  const { project, getProject } = props
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const [visible, setVisible] = useState(false)

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

      <AddTask
        visible={visible}
        project={project}
        getProject={getProject}
        setVisible={setVisible}
      />
    </>
  )
}

export default ProjectHeader
