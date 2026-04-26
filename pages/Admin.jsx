import React, { useEffect, useState } from 'react'
import { listAll, updateStatus } from '../api/complaints'
import { useToast } from '../hooks/useToast'
import Spinner from '../components/Spinner'
import ComplaintBadge from '../components/ComplaintBadge'

const PAGE_SIZE = 10

export default function Admin(){
  const [list, setList] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { push } = useToast()

  async function load(){
    setLoading(true)
    try{
      const res = await listAll()
      setList(res)
      setFiltered(res)
      setPage(1)
    }catch(err){ push('error', err.message) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  useEffect(()=>{
    let out = list.slice()
    if (categoryFilter) out = out.filter(x=>x.category === categoryFilter)
    if (statusFilter) out = out.filter(x=>x.status === statusFilter)
    setFiltered(out)
    setPage(1)
  }, [categoryFilter, statusFilter, list])

  async function handleStatusChange(id, newStatus){
    // optimistic UI
    const old = list.slice()
    setList(l => l.map(c => c.id === id ? { ...c, status: newStatus } : c))
    try{
      const res = await updateStatus(id, newStatus)
      if (!res.success){
        push('error','Failed to update status')
        setList(old)
      } else {
        push('success','Status updated')
      }
    }catch(err){ push('error', err.message); setList(old) }
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  return (
    <div>
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-semibold">All Complaints</h2>
          <div className="flex gap-2">
            <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">All Categories</option>
              <option>Academic</option>
              <option>Hostel</option>
              <option>Transport</option>
              <option>Other</option>
            </select>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">All Statuses</option>
              <option>Pending</option>
              <option>Resolved</option>
              <option>Rejected</option>
            </select>
            <button onClick={load} className="text-sm text-blue-600">Refresh</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? <div className="flex justify-center"><Spinner/></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600 border-b">
                  <th className="py-2">ID</th>
                  <th>Student ID</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(c=> (
                  <tr key={c.id} className="border-b align-top">
                    <td className="py-2 text-sm">{c.id}</td>
                    <td className="text-sm">{c.studentId}</td>
                    <td className="text-sm">{c.category}</td>
                    <td className="text-sm max-w-xs truncate" title={c.description}>{c.description}</td>
                    <td className="text-sm"><ComplaintBadge status={c.status} /></td>
                    <td className="text-sm">{new Date(c.createdAt).toLocaleString()}</td>
                    <td className="text-sm">
                      <select defaultValue={c.status} onChange={e=>handleStatusChange(c.id, e.target.value)} className="border px-2 py-1 rounded">
                        <option>Pending</option>
                        <option>Resolved</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
              <div className="flex gap-2">
                <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
                <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
