import { useNavigate } from 'react-router'
import { Card, Form, Input, Button, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import api from '../../api'

const Login = () => {
  const navigate = useNavigate()

  const onFinish = (values: any) => {
    api.user.login(values).then((res) => {
      if (res.code === 200) {
        message.success(res.msg)
        localStorage.setItem('task-token', res.data.token)
        localStorage.setItem('task-user', JSON.stringify(res.data.user))
        navigate('/')
      } else {
        message.error(res.msg)
      }
    })
  }

  const register = () => {
    navigate('/register')
  }

  return (
    <div className="w-full h-full bg-[#f8f8f8] flex justify-center items-center">
      <Card>
        <div className="font-bold text-3xl text-center mb-5">Welcome DuDuTask</div>
        <div className="mb-6 text-sm text-[#aaa] text-center">输入您的凭证以访问您的帐户</div>
        <Form name="basic" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{ width: 400 }} initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '用户名不能为空' },
              { min: 2, max: 6, message: '用户名在2-6位之间' }
            ]}
          >
            <Input placeholder="请输入用户名" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '密码不能为空' },
              { min: 6, max: 15, message: '用户名在6-15位之间' }
            ]}
          >
            <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="mt-6 flex text-sm">
          <div className="text-[#aaa]">还没有账号?</div>
          <div className="ml-2 text-[#1677ff] cursor-pointer" onClick={register}>
            注册账号
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Login
