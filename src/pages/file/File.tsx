import React, { useEffect, useState } from 'react'
import FileHeader from '../../components/file/FileHeader'
import FileTable from '../../components/file/FileTable'
import api from '../../api'
import { FileItem } from '../../types/file'

const File = () => {
  const [fileList, setFileList] = useState<FileItem[]>([])

  const getFileList = (params?: { user_id?: string; name?: string; dirId?: number }) => {
    api.file.getFileList(params).then((res) => {
      if (res.code === 200) {
        setFileList(res.data)
      }
    })
  }

  useEffect(() => {
    getFileList()
  }, [])

  return (
    <div className="p-[30px] h-full w-full">
      <FileHeader getFileList={getFileList} />
      <FileTable fileList={fileList} />
    </div>
  )
}

export default File
