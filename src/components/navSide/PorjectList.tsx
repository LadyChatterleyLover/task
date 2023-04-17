import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Progress, message } from 'antd'
import api from '../../api'
import { ProjectItem } from '../../types/project'

interface Props {
  setPath: (val: string) => void
}

const PorjectList = forwardRef((props: Props, ref) => {
  const { setPath } = props
  const user = JSON.parse(localStorage.getItem('task-user')!)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [projectList, setProjectList] = useState<ProjectItem[]>([])
  const [current, setCurrent] = useState(-1)
  const [visible, setVisible] = useState(false)

  const [form] = Form.useForm()

  const getProjectList = () => {
    api.project.getProjectList().then((res) => {
      res.data.map((item) => {
        item.flag = false
        item.myTasks = item.tasks.filter((i) => i.users.map((u) => u.id).includes(user.id))
      })
      setProjectList(res.data)
    })
  }

  const clickItem = (item: ProjectItem) => {
    setPath('')
    setCurrent(item.id)
    navigate('/project?id=' + item.id)
  }

  const clickProject = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: ProjectItem) => {
    e.preventDefault()
    item.flag = !item.flag
    setProjectList([...projectList])
  }

  const setCurrentProject = (val: number) => {
    setCurrent(val)
  }

  const onOk = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue()
        api.project
          .addProject(values)
          .then((res) => {
            if (res.code === 200) {
              message.success(res.msg)
              getProjectList()
              onCancel()
            } else {
              message.error(res.msg)
            }
          })
          .catch(() => {
            onCancel()
          })
      })
      .catch(() => {
        message.error('表单填写有误,请检查')
      })
  }

  const onCancel = () => {
    setVisible(false)
    form.resetFields()
  }

  useEffect(() => {
    if (!projectList.length) {
      getProjectList()
    }
  }, [])

  useEffect(() => {
    const value = searchParams.get('id')!
    setCurrent(+value)
  }, [searchParams])

  useImperativeHandle(ref, () => ({
    setCurrentProject
  }))

  return (
    <div className="mt-7">
      {projectList.length
        ? projectList.map((item) => {
            return (
              <div key={item.id}>
                <div className="flex items-center py-2 px-1 mb-3 cursor-pointer" style={{ background: current === item.id ? '#fff' : 'inherit' }}>
                  <div className="flex items-center" onClick={(e) => clickProject(e, item)}>
                    <CaretRightOutlined style={{ color: '#999' }} />
                  </div>
                  <div className="ml-2" onClick={() => clickItem(item)}>
                    {item.name}
                  </div>
                </div>
                {item.flag ? (
                  <div className="text-xs ml-7">
                    <div className="mb-4 flex items-center">
                      <div>我的:</div>
                      <div className="ml-1">
                        {item.myTasks!.filter((i) => i.completed).length}/{item.myTasks!.length}
                      </div>
                      <div className="flex-1 relative top-[3px] left-1">
                        <Progress percent={item.myTasks!.filter((i) => i.completed).length / item.myTasks!.length}></Progress>
                      </div>
                    </div>
                    <div className="mb-4 flex items-center">
                      <div>全部:</div>
                      <div className="ml-1">
                        {item.tasks.filter((i) => i.completed).length}/{item.tasks.length}
                      </div>
                      <div className="flex-1 relative top-[3px] left-1">
                        <Progress percent={item.tasks.filter((i) => i.completed).length / item.tasks.length}></Progress>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })
        : null}
      <div className="fixed bottom-5">
        <Button type="primary" size="large" icon={<PlusOutlined />} style={{ width: 260 }} onClick={() => setVisible(true)}>
          新建项目
        </Button>
      </div>
      <Modal open={visible} title="新建项目" okText="添加" onOk={onOk} onCancel={onCancel}>
        <Form form={form}>
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '项目名称不能为空' }]}>
            <Input placeholder="请输入项目名称" allowClear autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
})

export default PorjectList
