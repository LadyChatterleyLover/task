import { TaskItem } from '../../../types/task'
import { patch, post, remove } from '../../request'

export default {
  getTaskList() {
    return post<TaskItem[]>('/task/list')
  },
  getTaskDetail(params: {
    projectId: number
    userId: number
    current: number
    size: number
    keyword: string
  }) {
    return post<TaskItem[]>('/task/detail', params)
  },
  addTask(params: Partial<TaskItem>) {
    return post('/task', params)
  },
  updateTask(id: number, params: Partial<TaskItem>) {
    return patch(`/task/${id}`, params)
  },
  deleteTask(id: number) {
    return remove(`/task/${id}`)
  }
}
