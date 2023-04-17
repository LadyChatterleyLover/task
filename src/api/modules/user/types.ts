export interface LoginUser {
  token: string
  user: {
    createAt: string
    email: string
    id: number
    nickname: string
    role: string
    updateAt: string
    username: string
    avatar: string
  }
}
