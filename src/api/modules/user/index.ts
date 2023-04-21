import { LoginUser } from './types'
import { get, post } from '../../request'
import { TaskItem } from '../../../types/task'
import { FileItem } from '../../../types/file'

export default {
  login(params: { username: string; password: string }) {
    return post<LoginUser>('/user/login', params)
  },
  register(params: { username: string; password: string }) {
    return post('/user/register', params)
  },
  userList() {
    return get<LoginUser['user'][]>('/user')
  },
  findTask(params: { id: number }) {
    return post<TaskItem[]>('/user/task', params)
  },
  findFile(params: { id: number }) {
    return post<FileItem[]>('/user/file', params)
  }
}
