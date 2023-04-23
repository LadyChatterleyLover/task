import React, { useState } from 'react'
import { Tag, Tooltip } from 'antd'
import { TaskItem } from '../../types/task'
import UpdateTask from '../project/UpdateTask'
import TaskSetting from '../project/TaskSetting'

interface Props {
  taskList: TaskItem[]
  getTaskList: () => void
}

const Task = (props: Props) => {
  const { taskList, getTaskList } = props
  const [visible, setVisible] = useState(false)
  const [currentTask, setCurrentTask] = useState<TaskItem>()

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

  return (
    <>
      <div className="mt-[60px] w-[660px] max-h-[80%] mx-auto">
        {taskList.length ? (
          <div className="mt-4">
            {taskList.map((item) => {
              return (
                <div
                  key={item.id}
                  className="relative flex items-center p-3 mb-2 rounded-md cursor-pointer"
                  onClick={() => {
                    setCurrentTask(item)
                    setVisible(true)
                  }}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <TaskSetting task={item} getTaskDetail={getTaskList}>
                      <div
                        className="w-4 h-4 cursor-pointer mr-3"
                        style={{ border: '1px solid #eee' }}
                        onClick={(e) => e.stopPropagation()}
                      ></div>
                    </TaskSetting>
                  </div>
                  <div className="absolute top-[18px] left-0 w-[2px] h-[12px] bg-[#ed4014]"></div>
                  {renderStatus(item.status)}
                  <div className="text-sm flex-1 ml-1">{item.name}</div>
                  <Tooltip title={item.endTime} placement="right">
                    <div>{item.diffTime}</div>
                  </Tooltip>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
      <UpdateTask
        task={currentTask as TaskItem}
        visible={visible}
        setVisible={setVisible}
        getTaskDetail={getTaskList}
      ></UpdateTask>
    </>
  )
}

export default Task
