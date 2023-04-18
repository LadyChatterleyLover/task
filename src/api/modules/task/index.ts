import { TaskItem } from '../../../types/task'
import { patch, post, remove } from '../../request'

export default {
  getTaskDetail(params: { projectId: number; userId: number }) {
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
  },
  searchTask(keyword: string) {
    return post('/task', {
      keyword
    })
  }
}
