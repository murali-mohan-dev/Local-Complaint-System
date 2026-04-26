import { useCallback } from 'react'

export function useAuth(){
  const setAuth = useCallback((role, studentId=null)=>{
    if (role) {
      sessionStorage.setItem('role', role)
      if (studentId) sessionStorage.setItem('studentId', String(studentId))
    }
  }, [])

  const getRole = useCallback(()=> sessionStorage.getItem('role'), [])
  const getStudentId = useCallback(()=> sessionStorage.getItem('studentId') || '', [])
  const logout = useCallback(()=>{ sessionStorage.removeItem('role'); sessionStorage.removeItem('studentId') }, [])

  return { setAuth, getRole, getStudentId, logout }
}

export default useAuth
