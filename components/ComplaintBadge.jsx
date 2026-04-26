import React from 'react'

export default function ComplaintBadge({ status }){
  const cls = status === 'Resolved' ? 'bg-green-100 text-green-800' : status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>
  )
}
