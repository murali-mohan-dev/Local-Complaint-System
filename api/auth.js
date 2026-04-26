export async function loginUser(email, password){
  const params = new URLSearchParams({ email, password })
  try{
    const res = await fetch('/LoginServlet?' + params.toString(), { method: 'GET' })
    const text = await res.text()
    return text.trim() // 'student' | 'admin' | 'invalid'
  }catch(err){
    throw new Error('Network error')
  }
}
