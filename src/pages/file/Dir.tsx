import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../api'
import { FileItem } from '../../types/file'
import FileHeader from '../../components/file/FileHeader'
import FileTable from '../../components/file/FileTable'

const Dir = () => {
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [searchParams] = useSearchParams()

  const getFileList = (params?: { user_id?: string; name?: string; dirId?: number }) => {
    const { dirId } = params as { user_id?: string; name?: string; dirId?: number }
    api.file
      .getFileList({
        dirId
      })
      .then((res) => {
        if (res.code === 200) {
          setFileList(res.data)
        }
      })
  }

  useEffect(() => {
    const dirId = Number(searchParams.get('id') as string)
    getFileList({
      dirId
    })
  }, [searchParams])

  return (
    <div className="p-[30px] h-full w-full">
      <FileHeader getFileList={getFileList} />
      <FileTable fileList={fileList} />
    </div>
  )
}

export default Dir
