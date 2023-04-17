import { LoginUser } from '../api/modules/user/types'

export interface TaskItem {
  createAt: string
  desc: string
  endTime: string
  id: number
  name: string
  startTime: string
  updateAt: string
  completed: boolean
  users: LoginUser['user'][]
}
