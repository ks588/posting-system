export async function postByUserId(): Promise<Post[]> {
  // Extract userId from sessionStorage token
  const token = sessionStorage.getItem('authToken')
  if (!token) throw new Error('No auth token found')

  // Decode token payload (base64)
  const base64Payload = token.split('.')[1]
  const payload = JSON.parse(atob(base64Payload))
  const userId = payload.sub

  const res = await fetch(`http://localhost:3000/post/user/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch posts')

  const json = await res.json()

  if (!json.status) throw new Error(json.message || 'API error')

  return json.data
}
