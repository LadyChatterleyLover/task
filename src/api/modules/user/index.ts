import { LoginUser } from './types'
import { post } from '../../request'

export default {
  login(params: { username: string; password: string }) {
    return post<LoginUser>('/user/login', params)
  },
  register(params: { username: string; password: string }) {
    return post('/user/register', params)
  }
}
