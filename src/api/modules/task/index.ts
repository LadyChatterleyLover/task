import { TaskItem } from '../../../types/task'
import { patch, post, remove } from '../../request'

export default {
  getTaskDetail(params: { projectId: number; userId: number }) {
    return post<TaskItem[]>('/task/detail', params)
  },
  updateTask(id: number, params: Partial<TaskItem>) {
    return patch(`/task/${id}`, params)
  },
  deleteTask(id: number) {
    return remove(`/task/${id}`)
  }
}
