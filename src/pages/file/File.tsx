import React, { useEffect, useState } from 'react'
import FileHeader from '../../components/file/FileHeader'
import FileTable from '../../components/file/FileTable'
import api from '../../api'
import { FileItem } from '../../types/file'
import { LoginUser } from '../../api/modules/user/types'

const File = () => {
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const [fileList, setFileList] = useState<FileItem[]>([])

  const getFileList = (params?: { user_id?: string; name?: string; dirId?: number | null }) => {
    api.file.getFileList(params).then((res) => {
      if (res.code === 200) {
        setFileList(res.data)
      }
    })
  }

  const changeMyFile = (val: boolean) => {
    if (val) {
      getFileList({
        user_id: String(user.id)
      })
    } else {
      getFileList()
    }
  }

  useEffect(() => {
    getFileList()
  }, [])

  return (
    <div className="p-[30px] h-full w-full">
      <FileHeader getFileList={getFileList} />
      <FileTable fileList={fileList} changeMyFile={changeMyFile} />
    </div>
  )
}

export default File
