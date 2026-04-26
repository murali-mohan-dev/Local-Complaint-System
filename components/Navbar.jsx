import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar(){
  const { getRole, logout } = useAuth()
  const navigate = useNavigate()
  const role = getRole()

  function handleLogout(){
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold">Complaint System</Link>
        <div className="flex items-center space-x-3">
          {role === 'student' && <Link to="/student" className="text-sm">Student</Link>}
          {role === 'admin' && <Link to="/admin" className="text-sm">Admin</Link>}
          {role && <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>}
        </div>
      </div>
    </header>
  )
}
