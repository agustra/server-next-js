function generateUsers(start: number, length: number) {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'William', 'Jennifer', 'Richard', 'Linda', 'Charles', 'Patricia', 'Thomas', 'Barbara', 'Christopher', 'Elizabeth', 'Daniel', 'Helen', 'Matthew', 'Nancy', 'Anthony', 'Betty', 'Mark', 'Dorothy', 'Donald', 'Sandra', 'Steven', 'Donna', 'Paul', 'Carol', 'Andrew', 'Ruth', 'Joshua', 'Sharon', 'Kenneth', 'Michelle', 'Kevin', 'Laura', 'Brian', 'Sarah', 'George', 'Kimberly', 'Edward', 'Deborah', 'Ronald', 'Amy']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts']
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com']
  
  const users = []
  for (let i = start + 1; i <= start + length; i++) {
    const firstName = firstNames[(i - 1) % firstNames.length]
    const lastName = lastNames[Math.floor((i - 1) / firstNames.length) % lastNames.length]
    const domain = domains[(i - 1) % domains.length]
    
    users.push({
      id: i,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 2500 ? i : ''}@${domain}`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      age: 18 + (i % 50),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`
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