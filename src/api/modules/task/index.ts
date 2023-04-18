import { TaskItem } from '../../../types/task'
import { post } from '../../request'

export default {
  getTaskDetail(params: { projectId: number; userId: number }) {
    return post<TaskItem[]>('/task/detail', params)
  }
}
