function generateUsers(start: number, length: number) {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'William', 'Jennifer', 'Richard', 'Linda', 'Charles', 'Patricia', 'Thomas', 'Barbara', 'Christopher', 'Elizabeth', 'Daniel', 'Helen', 'Matthew', 'Nancy', 'Anthony', 'Betty', 'Mark', 'Dorothy', 'Donald', 'Sandra', 'Steven', 'Donna', 'Paul', 'Carol', 'Andrew', 'Ruth', 'Joshua', 'Sharon', 'Kenneth', 'Michelle', 'Kevin', 'Laura', 'Brian', 'Sarah', 'George', 'Kimberly', 'Edward', 'Deborah', 'Ronald', 'Amy']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts']
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com']
  
  const users = []
  for (let i = start + 1; i <= start + length; i++) {
    const firstName = firstNames[(i - 1) % firstNames.length]
    const lastName = lastNames[Math.floor((i - 1) / firstNames.length) % lastNames.length]
    const domain = domains[(i - 1) % domains.length]
    
    // Generate random date within last 3 years
    const randomDays = Math.floor(Math.random() * 1095) // 3 years in days
    const createdAt = new Date(Date.now() - (randomDays * 24 * 60 * 60 * 1000))
    
    users.push({
      id: i,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 2500 ? i : ''}@${domain}`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      age: 18 + (i % 50),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
      created_at: createdAt.toISOString().split('T')[0] // YYYY-MM-DD format
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
  
  // Column-specific searches
  const firstNameSearch = searchParams.get('columns[1][search][value]') || ''
  const lastNameSearch = searchParams.get('columns[2][search][value]') || ''
  const emailSearch = searchParams.get('columns[3][search][value]') || ''
  const phoneSearch = searchParams.get('columns[4][search][value]') || ''
  const ageSearch = searchParams.get('columns[5][search][value]') || ''
  const createdAtSearch = searchParams.get('columns[6][search][value]') || ''
  
  // ModernTable filters
  const filtersParam = searchParams.get('filters[created_at]') || ''
  
  // Advanced date filters
  const dateFilter = searchParams.get('date') || ''
  const startDate = searchParams.get('start_date') || ''
  const endDate = searchParams.get('end_date') || ''
  const yearFilter = searchParams.get('year') || ''
  const monthFilter = searchParams.get('month') || ''
  
  console.log('🔍 Search values:', {
    global: searchValue,
    firstName: firstNameSearch,
    lastName: lastNameSearch,
    email: emailSearch,
    phone: phoneSearch,
    age: ageSearch,
    createdAtFilter: filtersParam
  })
  
  // Generate all users for filtering
  const allUsers = generateUsers(0, 10000)
  
  // Filter users based on global search
  let filteredUsers = allUsers
  if (searchValue) {
    filteredUsers = filteredUsers.filter(user => 
      user.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.phone.includes(searchValue)
    )
  }
  
  // Filter by column-specific searches
  if (firstNameSearch) {
    filteredUsers = filteredUsers.filter(user => 
      user.firstName.toLowerCase().includes(firstNameSearch.toLowerCase())
    )
  }
  
  if (lastNameSearch) {
    filteredUsers = filteredUsers.filter(user => 
      user.lastName.toLowerCase().includes(lastNameSearch.toLowerCase())
    )
  }
  
  if (emailSearch) {
    filteredUsers = filteredUsers.filter(user => 
      user.email.toLowerCase().includes(emailSearch.toLowerCase())
    )
  }
  
  if (phoneSearch) {
    filteredUsers = filteredUsers.filter(user => 
      user.phone.includes(phoneSearch)
    )
  }
  
  if (ageSearch) {
    filteredUsers = filteredUsers.filter(user => 
      user.age.toString().includes(ageSearch)
    )
  }
  
  if (createdAtSearch) {
    filteredUsers = filteredUsers.filter(user => 
      user.created_at.includes(createdAtSearch)
    )
  }
  
  // ModernTable date filter
  if (filtersParam && /^\d{4}-\d{2}-\d{2}$/.test(filtersParam)) {
    console.log('📅 Filtering by date:', filtersParam)
    filteredUsers = filteredUsers.filter(user => 
      user.created_at === filtersParam
    )
  }
  
  // Advanced date filtering
  if (dateFilter && /^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
    filteredUsers = filteredUsers.filter(user => 
      user.created_at === dateFilter
    )
  }
  
  if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    filteredUsers = filteredUsers.filter(user => 
      user.created_at >= startDate
    )
  }
  
  if (endDate && /^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    filteredUsers = filteredUsers.filter(user => 
      user.created_at <= endDate
    )
  }
  
  if (yearFilter && /^\d{4}$/.test(yearFilter)) {
    filteredUsers = filteredUsers.filter(user => 
      user.created_at.startsWith(yearFilter)
    )
  }
  
  if (monthFilter && /^\d{4}-\d{2}$/.test(monthFilter)) {
    filteredUsers = filteredUsers.filter(user => 
      user.created_at.startsWith(monthFilter)
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