import React from 'react'
import { useRoutes } from 'react-router'
import Login from '../pages/login/Login'
import Layouts from '../pages/layouts/Layouts'
import Home from '../pages/home/Home'
import Register from '../pages/register/Register'
import File from '../pages/file/File'
import Calendar from '../pages/calendar/Calendar'
import Message from '../pages/message/Message'
import Project from '../pages/project/Project'

const Routes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <Layouts />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/file',
          element: <File />
        },
        {
          path: '/calendar',
          element: <Calendar />
        },
        {
          path: '/message',
          element: <Message />
        },
        {
          path: '/project',
          element: <Project />
        }
      ]
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> }
  ])
  return element
}

export default Routes
