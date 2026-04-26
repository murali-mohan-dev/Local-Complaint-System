import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const push = useCallback((type, message)=>{
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, type, message }])
    setTimeout(()=> setToasts(t => t.filter(x=>x.id !== id)), 3000)
  }, [])

  const remove = useCallback((id)=> setToasts(t=>t.filter(x=>x.id!==id)), [])

  return (
    <ToastContext.Provider value={{ push, remove, toasts }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`max-w-xs p-3 rounded shadow-lg text-white ${t.type==='error'? 'bg-red-600':'bg-green-600'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default useToast
