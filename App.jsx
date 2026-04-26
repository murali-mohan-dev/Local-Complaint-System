import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Student from './pages/Student'
import Admin from './pages/Admin'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'

function ProtectedRoute({ children, role }){
  const { getRole } = useAuth()
  const r = getRole()
  if (!r) return <Navigate to='/' replace />
  if (role && r !== role) return <Navigate to='/' replace />
  return children
}

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4 max-w-4xl mx-auto">
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/student' element={<ProtectedRoute role='student'><Student/></ProtectedRoute>} />
          <Route path='/admin' element={<ProtectedRoute role='admin'><Admin/></ProtectedRoute>} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </main>
    </div>
  )
}
