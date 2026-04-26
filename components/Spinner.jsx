import React from 'react'

export default function Spinner({ className = '' }){
  return (
    <div className={`inline-block animate-spin border-2 border-gray-300 border-t-gray-800 rounded-full w-5 h-5 ${className}`} role="status" aria-label="loading"></div>
  )
}
