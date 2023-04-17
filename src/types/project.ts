import { TaskItem } from './task'

export interface ProjectItem {
  id: number
  name: string
  createAt: string
  updateAt: string
  tasks: TaskItem[]
  myTasks?: TaskItem[]
  flag?: boolean
}
