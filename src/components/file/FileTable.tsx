import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Table,
  Checkbox,
  Empty,
  Image,
  TableColumnProps,
  Tag,
  Modal,
  message,
  Dropdown,
  MenuProps,
  Form,
  Input
} from 'antd'
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  MenuOutlined,
  MoreOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import { FileItem } from '../../types/file'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import api from '../../api'
import dayjs from 'dayjs'
import cloneDeep from 'lodash-es/cloneDeep'
import { useCopy } from '../../hooks/useCopy'

const { confirm } = Modal
interface Props {
  fileList: FileItem[]
  changeMyFile: (val: boolean) => void
}

const FileTable = (props: Props) => {
  const { fileList, changeMyFile } = props
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [myChecked, setMyChecked] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dirName, setDirName] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [cloneFileList, setCloneFileList] = useState<FileItem[]>([])
  const [currentFile, setCurrentFile] = useState<FileItem>()
  const [visible, setVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const [form] = Form.useForm()

  const iconList = [
    {
      icon: <MenuOutlined />
    },
    {
      icon: <UnorderedListOutlined />
    }
  ]
  const imgType = ['jpg', 'jpeg', 'png', 'gif']

  const columns: TableColumnProps<FileItem>[] = [
    {
      title: '文件名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      sorter: true,
      render: (_, record) => (
        <div className="flex items-center">
          <div>{renderFile(record, 22, 22)}</div>
          <div className="ml-[6px]">{record.name}</div>
        </div>
      )
    },
    {
      title: '大小',
      key: 'size',
      dataIndex: 'size',
      align: 'center',
      sorter: true,
      render: (_, record) => (
        <div>{record.size === 0 ? '-' : <span>{(record.size / 1024).toFixed(2)}kb</span>}</div>
      )
    },
    {
      title: '类型',
      key: 'ext',
      dataIndex: 'ext',
      align: 'center',
      sorter: true,
      render: (_, record) => <div>{!record.ext ? '文件夹' : record.ext}</div>
    },
    {
      title: '所有者',
      key: 'user',
      dataIndex: 'user',
      align: 'center',
      sorter: true,
      render: (_, record) => <div>{record.user.username}</div>
    },
    {
      title: '最后修改',
      key: 'updateAt',
      dataIndex: 'updateAt',
      align: 'center',
      sorter: true,
      render: (_, record) => <div>{dayjs(record.updateAt).format('YYYY-MM-DD HH:mm:ss')}</div>
    }
  ]

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const renderFile = (item: FileItem, width = 64, height = 64) => {
    if (imgType.includes(item.ext.toLowerCase())) {
      return (
        <Image
          src="https://www.dootask.com/js/build/picture.eff6e480.svg"
          preview={{ src: item.url, mask: null }}
          width={width}
          height={height}
        />
      )
    }
    if (item.isDir) {
      return (
        <Image
          src="https://www.dootask.com/js/build/folder.68818161.svg"
          preview={false}
          width={width}
          height={height}
          style={{ cursor: 'pointer' }}
        />
      )
    }
  }

  const clickFile = (item: FileItem) => {
    if (item.isDir) {
      navigate(`/file/dir?id=${item.id}&name=${item.name}`)
    }
  }

  const changeCheckbox = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked
    setMyChecked(checked)
    changeMyFile(checked)
  }

  const deleleFile = (content: string, ids: number[]) => {
    confirm({
      title: `删除文件`,
      icon: <ExclamationCircleFilled />,
      content,
      onOk() {
        api.file
          .patchDelete({
            ids
          })
          .then((res) => {
            if (res.code === 200) {
              message.success(res.msg)
              changeMyFile(myChecked)
            } else {
              message.error(res.msg)
            }
          })
      },
      onCancel() {
        message.info('已取消删除')
      }
    })
  }

  const changeFileChecked = (e: CheckboxChangeEvent, item: FileItem) => {
    let arr: React.Key[] = [...selectedRowKeys]
    const checked = e.target.checked
    item.checked = checked
    item.hovered = checked
    if (checked) {
      arr.push(item.id)
    } else {
      arr = arr.filter((i) => i !== item.id)
    }
    setSelectedRowKeys(arr)
    setCloneFileList([...cloneFileList])
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: `打开 "${currentFile?.name}"`
    },
    {
      key: '2',
      label: `${currentFile?.checked ? '取消选择' : '选择'}`
    },
    {
      type: 'divider'
    },
    {
      key: '3',
      label: `重命名`
    },
    {
      type: 'divider'
    },
    {
      key: '4',
      label: `发送`,
      disabled: currentFile?.isDir
    },
    {
      key: '5',
      label: `复制链接`,
      disabled: currentFile?.isDir
    },
    {
      key: '6',
      label: `下载`,
      disabled: currentFile?.isDir
    },
    {
      type: 'divider'
    },
    {
      key: '7',
      label: `删除`,
      danger: true
    }
  ]

  const clickMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      if (currentFile?.isDir) {
        navigate(`/file/dir?id=${currentFile.id}&name=${currentFile.name}`)
      } else {
        setVisible(true)
      }
    }
    if (key === '2') {
      let arr: React.Key[] = [...selectedRowKeys]
      ;(currentFile as FileItem).checked = !currentFile?.checked
      if (currentFile?.checked) {
        arr.push(currentFile?.id)
      } else {
        arr = arr.filter((i) => i !== currentFile?.id)
      }
      setSelectedRowKeys(arr)
    }
    if (key === '3') {
      form.setFieldValue(
        'name',
        currentFile?.isDir ? currentFile?.name : currentFile?.name.split('.').slice(0, -1)
      )
      setModalVisible(true)
    }
    if (key === '4') {
      //
    }
    if (key === '5') {
      const { copy } = useCopy(currentFile?.url as string, () => message.success('复制成功'))
      copy()
    }
    if (key === '6') {
      window.open(currentFile?.url)
    }
    if (key === '7') {
      deleleFile(`您确定删除${currentFile?.name}吗?`, [currentFile?.id as number])
    }
  }

  const rename = () => {
    form
      .validateFields()
      .then(() => {
        api.file
          .updateFile(currentFile?.id as number, {
            name: form.getFieldValue('name') + '.' + currentFile?.ext
          })
          .then((res) => {
            if (res.code === 200) {
              message.success(res.msg)
              form.resetFields()
              setModalVisible(false)
              changeMyFile(myChecked)
            } else {
              message.error(res.msg)
            }
          })
          .catch(() => {
            form.resetFields()
            setModalVisible(false)
          })
      })
      .catch(() => {
        message.error('表单填写有误,请检查')
      })
  }

  useEffect(() => {
    const dirName = searchParams.get('name') as string
    setDirName(dirName)
  }, [searchParams])

  useEffect(() => {
    if (fileList.length) {
      setCloneFileList(cloneDeep(fileList))
    }
  }, [fileList])

  return (
    <>
      <div className="mt-5 flex items-center justify-between">
        <div>
          <span
            style={{
              color: dirName ? '#84c56a' : '',
              cursor: dirName ? 'pointer' : 'default'
            }}
            onClick={() => navigate('/file')}
          >
            全部文件
          </span>
          {dirName ? (
            <span>
              <span className="mx-2">&gt;</span>
              <span>{dirName}</span>
            </span>
          ) : null}
          {selectedRowKeys.length ? (
            <>
              <span className="ml-2 cursor-pointer">
                <Tag
                  color="red"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    deleleFile(
                      `您确定删除${selectedRowKeys.length}个文件吗?`,
                      selectedRowKeys as number[]
                    )
                  }
                >
                  删除
                </Tag>
              </span>
              <span className="ml-2 cursor-pointer">
                <Tag color="#87d068" onClick={() => setSelectedRowKeys([])}>
                  取消选择
                </Tag>
              </span>
            </>
          ) : null}
        </div>
        <div className="flex items-center">
          <div>
            <Checkbox checked={myChecked} onChange={(e) => changeCheckbox(e)}>
              仅展示我的
            </Checkbox>
          </div>
          {iconList.map((item, index) => {
            return (
              <div
                key={index}
                className="mr-3 w-8 h-[30px] rounded-md flex items-center justify-center cursor-pointer"
                style={{
                  border: currentIndex === index ? '1px solid #84c56a' : 'none',
                  color: currentIndex === index ? '#84c56e' : 'inherit',
                  background: currentIndex === index ? '#f2f9f0' : '#fff'
                }}
                onClick={() => setCurrentIndex(index)}
              >
                {item.icon}
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-5">
        {cloneFileList.length ? (
          currentIndex === 0 ? (
            <div className="flex items-center flex-wrap">
              {cloneFileList.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="relative w-[100px] h-[108px] flex flex-col items-end justify-center cursor-pointer mr-5 hover:bg-[#f4f5f7]"
                    style={{ background: item.hovered ? '#f4f5f7' : '#fff' }}
                    onClick={() => clickFile(item)}
                    onMouseEnter={() => {
                      item.hovered = true
                      setCloneFileList([...cloneFileList])
                    }}
                    onMouseLeave={() => {
                      if (!item.checked) item.hovered = false
                      setCloneFileList([...cloneFileList])
                    }}
                  >
                    <div className="flex justify-center w-full">{renderFile(item)}</div>
                    <div className="w-full text-center mt-2">{item.name}</div>
                    {item.hovered ? (
                      <>
                        <div className="absolute top-0 left-2" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={item.checked}
                            onChange={(e) => changeFileChecked(e, item)}
                          ></Checkbox>
                        </div>
                        <div
                          className="absolute top-0 right-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentFile(item)
                          }}
                        >
                          <Dropdown
                            menu={{ items, onClick: clickMenu }}
                            placement="bottom"
                            trigger={['click']}
                          >
                            <MoreOutlined style={{ color: '#aaa', transform: 'rotate(90deg)' }} />
                          </Dropdown>
                        </div>
                      </>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              <Table
                rowKey="id"
                dataSource={fileList}
                columns={columns}
                rowSelection={rowSelection}
                pagination={false}
              ></Table>
            </div>
          )
        ) : (
          <div className="mt-[200px]">
            <Empty></Empty>
          </div>
        )}
      </div>
      {currentFile ? (
        <Image
          style={{ display: 'none' }}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
          preview={{
            visible,
            src: currentFile.url,
            onVisibleChange: (value) => {
              setVisible(value)
            }
          }}
        />
      ) : null}
      <Modal
        title="重命名"
        open={modalVisible}
        destroyOnClose
        maskClosable={false}
        onOk={rename}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
      >
        <Form form={form}>
          <Form.Item
            label="文件名"
            name="name"
            rules={[
              { required: true, message: '文件名不能为空' },
              { min: 2, message: '文件名至少为2个字符' }
            ]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default FileTable
