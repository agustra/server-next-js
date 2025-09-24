import { verifyToken } from '@/app/lib/auth'

function generateSecureUsers(start: number, length: number) {
  const users = []
  for (let i = start + 1; i <= start + length; i++) {
    users.push({
      id: i,
      firstName: `SecureUser${i}`,
      lastName: `Last${i}`,
      email: `secure${i}@example.com`,
      phone: `+1-555-${String(i).padStart(4, '0')}`,
      age: 18 + (i % 50),
      salary: 50000 + (i * 1000),
      department: ['IT', 'HR', 'Finance', 'Marketing'][i % 4]
    })
  }
  return users
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    
    if (!payload) {
      return Response.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const draw = searchParams.get('draw') || '1'
    const start = parseInt(searchParams.get('start') || '0')
    const length = parseInt(searchParams.get('length') || '10')
    
    const users = generateSecureUsers(start, length)

    const response = Response.json({
      draw: parseInt(draw),
      recordsTotal: 5000,
      recordsFiltered: 5000,
      data: users
    })

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
  } catch (error) {
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}