import React from 'react'
import { useEffect, useState } from 'react'
import { LoginUser } from '../../api/modules/user/types'
import { Avatar } from 'antd'

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<LoginUser['user']>()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('task-user') as string) as LoginUser['user']
    setUserInfo(user)
  }, [])
  return (
    <div className="p-5">
      {userInfo ? (
        <div className="bg-white p-3 flex items-center">
          <div>
            {userInfo.avatar ? (
              <Avatar size={36} style={{ background: '#028955' }} src={userInfo.avatar}></Avatar>
            ) : (
              <Avatar size={36} style={{ background: '#028955' }}>
                {userInfo.username.slice(0, 2)}
              </Avatar>
            )}
          </div>
          <div className="ml-5">{userInfo.username}</div>
        </div>
      ) : null}
    </div>
  )
}

export default UserInfo
