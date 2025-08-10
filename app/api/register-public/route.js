import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { jwtVerify } from 'jose'

const prisma = new PrismaClient()

async function verifyToken(req) {
  const token = req.cookies.get('token')?.value
  if (!token) throw new Error('Unauthorized: No token')
  const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
  return payload
}

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Name, email and password are required.' }),
        { status: 400 }
      )
    }

    // Check how many users exist
    const existingUsersCount = await prisma.user.count({
      where: { is_deleted: false }
    })

    if (existingUsersCount === 0) {
      // First user creation: allow without token, force ADMIN role (বা USER চাইলে করতে পারো)
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'ADMIN', // প্রথম ইউজারকে ADMIN রাখাটা ভালো practice
          insertedBy: 111,
        },
      })
      return new Response(JSON.stringify({ success: true, user, message: 'First admin user created' }), { status: 201 })
    } else {
      // পরে নতুন ইউজার তৈরির জন্য token verify করো
      const payload = await verifyToken(req)
      if (payload.role !== 'ADMIN') {
        return new Response(JSON.stringify({ success: false, message: 'Unauthorized: Only admin can create users' }), { status: 403 })
      }

      // Email uniqueness check
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return new Response(JSON.stringify({ success: false, message: 'Email already in use' }), { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role === 'ADMIN' ? 'ADMIN' : 'USER', // Allowed roles only
          insertedBy: parseInt(payload.id),
        },
      })

      return new Response(JSON.stringify({ success: true, user }), { status: 201 })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Server error', error: error.message }),
      { status: 500 }
    )
  }
}
