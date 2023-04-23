import React from 'react'
import { Form, Input, Modal, Select, DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import api from '../../api'
import { ProjectItem } from '../../types/project'
import { LoginUser } from '../../api/modules/user/types'

const { RangePicker } = DatePicker

interface Props {
  visible: boolean
  project: ProjectItem
  getProject: (val: string) => void
  setVisible: (val: boolean) => void
}

const AddTask = (props: Props) => {
  const { visible, project, getProject, setVisible } = props
  const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: '请选择时间' }]
  }
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const [form] = Form.useForm()

  const addTask = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue()
        const startTime = dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss')
        const endTime = dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss')
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
              form.resetFields()
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
  return (
    <Modal
      open={visible}
      title="添加任务"
      destroyOnClose
      onOk={addTask}
      onCancel={() => {
        form.resetFields()
        setVisible(false)
      }}
    >
      <Form form={form} initialValues={{ users: [user.id] }}>
        <Form.Item name="name" rules={[{ required: true, message: '任务名称不能为空' }]}>
          <Input placeholder="任务名称" allowClear />
        </Form.Item>
        <Form.Item name="desc" rules={[{ required: true, message: '任务描述不能为空' }]}>
          <Input placeholder="任务描述" allowClear />
        </Form.Item>
        {project && project.users && project.users.length ? (
          <Form.Item name="users">
            <Select placeholder="项目负责人" showSearch allowClear mode="multiple">
              {project.users.map((item) => {
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
          <RangePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['开始时间', '结束时间']}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddTask
