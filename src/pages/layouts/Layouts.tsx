import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NavSide from '../../components/navSide/NavSide'

const Layouts = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('task-token')
    if (!token) {
      navigate('/login')
    }
  }, [])
  return (
    <div className="flex h-full w-full">
      <div className="w-[300px] h-full bg-[#f4f5f7]">
        <NavSide />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default Layouts
