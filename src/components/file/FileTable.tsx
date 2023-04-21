import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Table, Checkbox, Empty, Image, TableColumnProps, Tag, Modal, message } from 'antd'
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  MenuOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import { FileItem } from '../../types/file'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import api from '../../api'
import dayjs from 'dayjs'

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
  const [currentIndex, setCurrentIndex] = useState(1)
  const [dirName, setDirName] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

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
          preview={{ src: item.url }}
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

  const deleleFile = () => {
    confirm({
      title: `删除文件`,
      icon: <ExclamationCircleFilled />,
      content: `您确定删除${selectedRowKeys.length}个文件吗?`,
      onOk() {
        api.file
          .patchDelete({
            ids: selectedRowKeys as number[]
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

  useEffect(() => {
    const dirName = searchParams.get('name') as string
    setDirName(dirName)
  }, [searchParams])

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
                <Tag color="red" icon={<DeleteOutlined />} onClick={deleleFile}>
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
        {fileList.length ? (
          currentIndex === 0 ? (
            <div className="flex items-center flex-wrap">
              {fileList.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="w-[100px] h-[124px] flex flex-col items-end justify-center"
                    onClick={() => clickFile(item)}
                  >
                    <div className="flex justify-center w-full">{renderFile(item)}</div>
                    <div className="w-full text-center mt-2">{item.name}</div>
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
    </>
  )
}

export default FileTable
