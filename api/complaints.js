export async function fileComplaint(studentId, category, description){
  const params = new URLSearchParams({ action: 'file', studentId, category, description })
  try{
    const res = await fetch('/ComplaintServlet?' + params.toString(), { method: 'GET' })
    return await res.json()
  }catch(err){
    throw new Error('Network error')
  }
}

export async function listByStudent(studentId){
  const params = new URLSearchParams({ action: 'listByStudent', studentId })
  try{
    const res = await fetch('/ComplaintServlet?' + params.toString(), { method: 'GET' })
    return await res.json()
  }catch(err){
    throw new Error('Network error')
  }
}

export async function listAll(){
  const params = new URLSearchParams({ action: 'listAll' })
  try{
    const res = await fetch('/ComplaintServlet?' + params.toString(), { method: 'GET' })
    return await res.json()
  }catch(err){
    throw new Error('Network error')
  }
}

export async function updateStatus(complaintId, newStatus){
  const params = new URLSearchParams({ action: 'updateStatus', complaintId, newStatus })
  try{
    const res = await fetch('/ComplaintServlet?' + params.toString(), { method: 'GET' })
    return await res.json()
  }catch(err){
    throw new Error('Network error')
  }
}
