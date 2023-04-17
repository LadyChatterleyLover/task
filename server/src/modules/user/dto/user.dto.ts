export class CreateUserDto {
  username: string
  password: string
  email: string
  role?: string
  nickname?: string
}

export class UserDto {
  username: string
  password: string
  email: string
}
