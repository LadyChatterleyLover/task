import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../api'
import { FileItem } from '../../types/file'
import FileHeader from '../../components/file/FileHeader'
import FileTable from '../../components/file/FileTable'
import { LoginUser } from '../../api/modules/user/types'

const Dir = () => {
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [searchParams] = useSearchParams()

  const getFileList = (params?: { user_id?: string; name?: string; dirId?: number | null }) => {
    const { dirId } = params as { user_id?: string; name?: string; dirId?: number | null }
    api.file
      .getFileList({
        dirId
      })
      .then((res) => {
        if (res.code === 200) {
          res.data.map((item) => {
            item.checked = false
            item.hovered = false
          })
          setFileList(res.data)
        }
      })
  }

  const getUserFile = (params: { user_id: number }) => {
    api.user
      .findFile({
        id: params.user_id
      })
      .then((res) => {
        if (res.code === 200) {
          res.data.map((item) => {
            item.checked = false
            item.hovered = false
          })
          setFileList(res.data)
        }
      })
  }

  const changeMyFile = (val: boolean) => {
    if (val) {
      getUserFile({
        user_id: user.id
      })
    } else {
      getFileList()
    }
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
      <FileTable fileList={fileList} changeMyFile={changeMyFile} />
    </div>
  )
}

export default Dir
