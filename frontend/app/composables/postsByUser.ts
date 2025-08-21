interface Post {
  id: number
  title: string
  description: string
  imageUrl?: string
  userId: number
  createdAt?: string
}

export async function postByUserId(): Promise<Post[]> {
  const token = sessionStorage.getItem('authtoken')
  console.log('Token:', token)
  if (!token) throw new Error('No auth token found')

  const tokenParts = token.split('.')
  if (tokenParts.length < 2) throw new Error('Invalid token')

  // Decode URL-safe Base64 payload
  const base64Payload = tokenParts[1]
  const payloadJson = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'))
  const payload = JSON.parse(payloadJson)

  const userId = payload.sub
  if (!userId) throw new Error('User ID not found in token')

  const res = await fetch(`http://localhost:3000/post/user/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch posts')

  const json = await res.json()
  if (!json.status) throw new Error(json.message || 'API error')

  return json.data as Post[]
}
