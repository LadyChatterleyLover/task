import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Checkbox, Empty, Image } from 'antd'
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dirName, setDirName] = useState('')

  const iconList = [
    {
      icon: <MenuOutlined />
    },
    {
      icon: <UnorderedListOutlined />
    }
  ]
  const imgType = ['jpg', 'jpeg', 'png', 'gif']

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
          <div className="mt-[200px]">
            <Empty></Empty>
          </div>
        )}
      </div>
    </>
  )
}

export default FileTable
