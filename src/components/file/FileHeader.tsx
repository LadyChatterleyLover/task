import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Avatar, Input, Popover, Dropdown, MenuProps, Upload, Modal, Form, message } from 'antd'
import api from '../../api'

interface Props {
  getFileList: (params?: { user_id?: string; name?: string; dirId?: number | null }) => void
}

const FileHeader = (props: Props) => {
  const { getFileList } = props
  const [searchParams] = useSearchParams()
  const [form] = Form.useForm()
  const [keyword, setKeyword] = useState('')
  const [dirId, setDirId] = useState(0)
  const [visible, setVisible] = useState(false)

  const handleUpload = ({ file }: any) => {
    const formData = new FormData()
    formData.append('file', file, decodeURIComponent(file.name))
    api.file
      .upload({
        file,
        dirId: dirId > 0 ? dirId : null
      })
      .then((res) => {
        if (res.code === 200) {
          message.success(res.msg)
          getFileList({
            dirId: dirId > 0 ? dirId : null
          })
        } else {
          message.error(res.msg)
        }
      })
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex">
          <img src="https://www.dootask.com/js/build/folder.68818161.svg" width={20} height={20} />
          <div className="ml-1">新建文件夹</div>
        </div>
      )
    },
    {
      type: 'divider'
    },
    {
      key: '2',
      label: (
        <Upload showUploadList={false} customRequest={handleUpload}>
          <div className="flex">
            <img
              src="https://www.dootask.com/js/build/upload.01661a19.svg"
              width={20}
              height={20}
            />
            <div className="ml-1">上传文件</div>
          </div>
        </Upload>
      )
    },
    {
      key: '3',
      label: (
        <Upload showUploadList={false} customRequest={handleUpload} directory>
          <div className="flex">
            <img src="https://www.dootask.com/js/build/updir.354f6e04.svg" width={20} height={20} />
            <div className="ml-1">上传文件夹</div>
          </div>
        </Upload>
      )
    },
    {
      key: '4',
      label: (
        <div className="flex">
          <img
            src="https://www.dootask.com/js/build/document.624c4d76.svg"
            width={20}
            height={20}
          />
          <div className="ml-1">文本</div>
        </div>
      )
    },
    {
      key: '5',
      label: (
        <div className="flex">
          <img src="https://www.dootask.com/js/build/flow.a58ab0df.svg" width={20} height={20} />
          <div className="ml-1">图表</div>
        </div>
      )
    },
    {
      key: '6',
      label: (
        <div className="flex">
          <img src="https://www.dootask.com/js/build/mind.9f75182d.svg" width={20} height={20} />
          <div className="ml-1">思维导图</div>
        </div>
      )
    },
    {
      type: 'divider'
    },
    {
      key: '7',
      label: (
        <div className="flex">
          <img src="https://www.dootask.com/js/build/word.d0364128.svg" width={20} height={20} />
          <div className="ml-1">Word 文档</div>
        </div>
      )
    },
    {
      key: '8',
      label: (
        <div className="flex">
          <img src="https://www.dootask.com/js/build/excel.82abb1cd.svg" width={20} height={20} />
          <div className="ml-1">Excel 工作表</div>
        </div>
      )
    },
    {
      key: '9',
      label: (
        <div className="flex">
          <img src="https://www.dootask.com/js/build/ppt.03f2290d.svg" width={20} height={20} />
          <div className="ml-1">PPT 演示文稿</div>
        </div>
      )
    }
  ]

  const onPressEnter = () => {
    getFileList({
      name: keyword
    })
  }

  const clickMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      setVisible(true)
    }
  }

  const createDir = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue()
        api.file
          .createDir(values)
          .then((res) => {
            if (res.code === 200) {
              message.success(res.msg)
              setVisible(false)
              getFileList()
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

  const content = (
    <Input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onPressEnter={onPressEnter}
      placeholder="请输入项目名称"
      allowClear
    />
  )

  useEffect(() => {
    const dirId = Number(searchParams.get('id') as string)
    setDirId(dirId)
  }, [searchParams])

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="font-bold text-3xl">文件</div>
        <div className="flex items-center">
          <div className="mr-5 cursor-pointer">
            <Popover content={content} trigger="click">
              <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
                <SearchOutlined />
              </Avatar>
            </Popover>
          </div>
          <div className="mr-5 cursor-pointer">
            <Dropdown menu={{ items, onClick: clickMenu }} trigger={['click']}>
              <Avatar style={{ background: '#f2f3f5', color: '#606266' }}>
                <PlusOutlined />
              </Avatar>
            </Dropdown>
          </div>
        </div>
      </div>
      <Modal
        title="新建文件夹"
        open={visible}
        destroyOnClose
        onOk={createDir}
        onCancel={() => {
          setVisible(false)
          form.resetFields()
        }}
      >
        <Form form={form}>
          <Form.Item
            label="文件夹名称"
            name="name"
            rules={[
              { required: true, message: '文件夹名称不能为空' },
              { min: 2, message: '文件夹名称不能少于2个字' }
            ]}
          >
            <Input placeholder="文件夹名称" allowClear autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default FileHeader
