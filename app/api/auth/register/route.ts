import { createUser, findUserByEmail, createToken } from '@/app/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return Response.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    if (findUserByEmail(email)) {
      return Response.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    const user = createUser({
      email,
      password,
      firstName,
      lastName,
      role: 'user'
    })

    const token = await createToken(user)

    const response = Response.json({
      success: true,
      message: 'Registrasi berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}