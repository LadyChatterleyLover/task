import { LoginUser } from '../api/modules/user/types'
import { TaskItem } from './task'

export interface ProjectItem {
  id: number
  name: string
  createAt: string
  updateAt: string
  tasks: TaskItem[]
  myTasks?: TaskItem[]
  users: LoginUser['user'][]
  flag?: boolean
}
