import { LoginUser } from '../api/modules/user/types'

export interface TaskItem {
  createAt: string
  desc: string
  endTime: string
  id: number
  status: number
  name: string
  startTime: string
  updateAt: string
  level: string
  completed: boolean
  bgColor: string
  users: LoginUser['user'][]
  diffTime?: JSX.Element
}
