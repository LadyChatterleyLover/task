import React, { useState } from 'react'
import { Avatar, Input, Popover, Tooltip } from 'antd'
import { ProjectItem } from '../../types/project'
import { LoginUser } from '../../api/modules/user/types'
import { PlusOutlined, SearchOutlined, WechatOutlined } from '@ant-design/icons'
import AddTask from './AddTask'
import ProjectSetting from './ProjectSetting'

interface Props {
  keyword: string
  setKeyword: (val: string) => void
  project: ProjectItem
  getProject: (val: string) => void
  searchConfirm: () => void
}

const ProjectHeader = (props: Props) => {
  const { keyword, setKeyword, project, getProject, searchConfirm } = props
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const [visible, setVisible] = useState(false)

  const onPressEnter = () => {
    searchConfirm()
  }

  const content = (
    <Input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onPressEnter={onPressEnter}
      placeholder="ID、名称、描述..."
      allowClear
    />
  )

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
              <Popover content={content} trigger="click">
                <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
                  <SearchOutlined />
                </Avatar>
              </Popover>
            </div>
            <div className="mr-3 cursor-pointer">
              <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
                <WechatOutlined />
              </Avatar>
            </div>
            <div className="mr-3 cursor-pointer">
              <ProjectSetting project={project} getProject={getProject} />
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
