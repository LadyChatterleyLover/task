import { FileItem } from '../../../types/file'
import { patch, post, postFormData } from '../../request'

export default {
  getFileList(params?: { user_id?: string; name?: string; dirId?: number | null }) {
    return post<FileItem[]>('/file', params)
  },
  upload(params: { file: File; dirId: number | null }) {
    return postFormData('/file/upload', params)
  },
  createDir(params: { name: string }) {
    return post<FileItem[]>('/file/createDir', params)
  },
  patchDelete(params: { ids: number[] }) {
    return post('/file/patchDelete', params)
  },
  updateFile(id: number, params: Partial<FileItem>) {
    return patch(`/file/${id}`, params)
  }
}
