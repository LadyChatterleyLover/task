import React from 'react'
import { Table, TableColumnProps } from 'antd'
import { ProjectItem } from '../../types/project'
import { TaskItem } from '../../types/task'

interface Props {
  project: ProjectItem
}

const ProjectTable = (props: Props) => {
  const { project } = props
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
      align: 'center'
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
    }
  ]
  return project ? <Table rowKey="id" dataSource={project.tasks} columns={columns}></Table> : null
}

export default ProjectTable
