function generateUsers(start: number, length: number) {
  const users = []
  for (let i = start + 1; i <= start + length; i++) {
    users.push({
      id: i,
      firstName: `User${i}`,
      lastName: `Last${i}`,
      email: `user${i}@example.com`,
      phone: `+1-555-${String(i).padStart(4, '0')}`,
      age: 18 + (i % 50)
    })
  }
  return users
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const draw = searchParams.get('draw') || '1'
  const start = parseInt(searchParams.get('start') || '0')
  const length = parseInt(searchParams.get('length') || '10')
  const searchValue = searchParams.get('search[value]') || ''
  
  console.log('🔍 Server received search:', searchValue)
  
  // Generate all users for filtering
  const allUsers = generateUsers(0, 10000)
  
  // Filter users based on search
  let filteredUsers = allUsers
  if (searchValue) {
    filteredUsers = allUsers.filter(user => 
      user.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.phone.includes(searchValue)
    )
  }
  
  // Paginate filtered results
  const paginatedUsers = filteredUsers.slice(start, start + length)
  
  const response = Response.json({
    draw: parseInt(draw),
    recordsTotal: 10000,
    recordsFiltered: filteredUsers.length,
    data: paginatedUsers
  })
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  
  return response
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}