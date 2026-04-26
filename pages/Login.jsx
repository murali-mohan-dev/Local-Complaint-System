import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import Spinner from '../components/Spinner'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { push } = useToast()

  function validate(){
    if (!email || !password) { push('error','Please enter email and password'); return false }
    const re = /\S+@\S+\.\S+/; if (!re.test(email)) { push('error','Enter a valid email'); return false }
    return true
  }

  async function handleSubmit(e){
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try{
      const role = await loginUser(email, password)
      if (role === 'invalid'){
        push('error','Invalid credentials')
      } else if (role === 'student'){
        setAuth('student', studentId || '')
        push('success','Login successful')
        navigate('/student')
      } else if (role === 'admin'){
        setAuth('admin')
        push('success','Login successful')
        navigate('/admin')
      } else {
        push('error','Unexpected response')
      }
    }catch(err){
      push('error', err.message || 'Network error')
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <label className="block text-sm">Email<label className="sr-only">Email</label></label>
        <input className="w-full border px-3 py-2 rounded mb-3" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email" aria-label="email" />

        <label className="block text-sm">Password</label>
        <input className="w-full border px-3 py-2 rounded mb-3" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" aria-label="password" />

        <label className="block text-sm">Student ID (for student accounts)</label>
        <input className="w-full border px-3 py-2 rounded mb-3" value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="Optional: your student id" aria-label="studentId" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded flex justify-center items-center" disabled={loading}>
          {loading ? <Spinner/> : 'Login'}
        </button>
      </form>
    </div>
  )
}
