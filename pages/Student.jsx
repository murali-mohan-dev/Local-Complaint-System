import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { fileComplaint, listByStudent } from '../api/complaints'
import { useToast } from '../hooks/useToast'
import Spinner from '../components/Spinner'
import ComplaintBadge from '../components/ComplaintBadge'

export default function Student(){
  const { getStudentId, getRole } = useAuth()
  const studentIdStored = getStudentId()
  const [studentId, setStudentId] = useState(studentIdStored || '')
  const [category, setCategory] = useState('Academic')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [fetching, setFetching] = useState(false)
  const { push } = useToast()

  async function loadComplaints(){
    if (!studentId) { setList([]); return }
    setFetching(true)
    try{
      const res = await listByStudent(studentId)
      // sort newest first by createdAt
      res.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
      setList(res)
    }catch(err){ push('error', err.message) }
    finally{ setFetching(false) }
  }

  useEffect(()=>{ loadComplaints() }, [])

  async function handleSubmit(e){
    e.preventDefault()
    if (!studentId) { push('error','Student ID required'); return }
    if (!description.trim()) { push('error','Description required'); return }
    if (description.length > 500) { push('error','Description too long'); return }
    setLoading(true)
    try{
      const res = await fileComplaint(studentId, category, description)
      if (res.success){
        push('success','Complaint filed')
        setDescription('')
        loadComplaints()
      } else {
        push('error', res.message || 'Failed to file complaint')
      }
    }catch(err){ push('error', err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">File a Complaint</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm">Student ID</label>
          <input className="w-full border px-3 py-2 rounded mb-2" value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="Your student id" />

          <label className="block text-sm">Category</label>
          <select className="w-full border px-3 py-2 rounded mb-2" value={category} onChange={e=>setCategory(e.target.value)}>
            <option>Academic</option>
            <option>Hostel</option>
            <option>Transport</option>
            <option>Other</option>
          </select>

          <label className="block text-sm">Description <span className="text-xs text-gray-500">({description.length}/500)</span></label>
          <textarea className="w-full border px-3 py-2 rounded mb-3" value={description} onChange={e=>setDescription(e.target.value)} maxLength={500} rows={4}></textarea>

          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? <Spinner/> : 'Submit'}</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">My Complaints</h2>
          <div>
            <button onClick={loadComplaints} className="text-sm text-blue-600">Refresh</button>
          </div>
        </div>

        {fetching ? <div className="flex justify-center"><Spinner/></div> : (
          list.length === 0 ? <div className="text-gray-500">No complaints found.</div> : (
            <div className="space-y-3">
              {list.map(c => (
                <div key={c.id} className="border p-3 rounded">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">#{c.id} - {c.category}</div>
                    <ComplaintBadge status={c.status} />
                  </div>
                  <div className="mt-2 text-gray-700">{c.description}</div>
                  <div className="mt-2 text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
