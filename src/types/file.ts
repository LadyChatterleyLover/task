import { LoginUser } from '../api/modules/user/types'

export interface FileItem {
  id: number
  name: string
  url: string
  ext: string
  user: LoginUser['user']
  isDir: boolean
  dirId: number
  size: number
  createAt: string
  updateAt: string
  checked: boolean
  hovered: boolean
}
