import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Table, Checkbox, Empty, Image, TableColumnProps } from 'antd'
import { MenuOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { FileItem } from '../../types/file'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

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
      sorter: true
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
    }
  ]

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const renderFile = (item: FileItem) => {
    if (imgType.includes(item.ext.toLowerCase())) {
      return (
        <Image
          src="https://www.dootask.com/js/build/picture.eff6e480.svg"
          preview={{ src: item.url }}
          width={64}
          height={64}
        />
      )
    }
    if (item.isDir) {
      return (
        <Image
          src="https://www.dootask.com/js/build/folder.68818161.svg"
          preview={false}
          width={64}
          height={64}
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
