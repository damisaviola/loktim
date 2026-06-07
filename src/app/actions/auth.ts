'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-for-local-dev-change-in-prod'
const key = new TextEncoder().encode(JWT_SECRET_KEY)

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { success: false, error: 'Username dan kata sandi wajib diisi.' }
  }

  // Find admin in DB
  const admin = await prisma.admin.findUnique({
    where: { username }
  })

  if (!admin) {
    return { success: false, error: 'Username atau kata sandi salah.' }
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, admin.password)

  if (!isMatch) {
    return { success: false, error: 'Username atau kata sandi salah.' }
  }

  // Generate JWT
  const token = await new SignJWT({ adminId: admin.id, username: admin.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Session expires in 24 hours
    .sign(key)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  })

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getUserSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, key)
    return payload // { adminId, username, ... }
  } catch (error) {
    return null
  }
}
