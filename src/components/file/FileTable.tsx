import React, { useState } from 'react'
import { Checkbox, Empty } from 'antd'
import { MenuOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { FileItem } from '../../types/file'

interface Props {
  fileList: FileItem[]
}

const FileTable = (props: Props) => {
  const { fileList } = props
  const [myChecked, setMyChecked] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
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
        <img src="https://www.dootask.com/js/build/picture.eff6e480.svg" width={64} height={64} />
      )
    }
  }

  return (
    <>
      <div className="mt-5 flex items-center justify-between">
        <div>全部文件</div>
        <div className="flex items-center">
          <div>
            <Checkbox checked={myChecked} onChange={(e) => setMyChecked(e.target.checked)}>
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
