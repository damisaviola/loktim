'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { loginSchema } from '@/lib/validations/auth'
import { getClientIp, checkRateLimit } from '@/lib/rate-limit'

export async function loginAdmin(formData: FormData) {
  const ip = await getClientIp()
  const rateLimit = checkRateLimit('login_admin', ip, 5, 15 * 60 * 1000) // 5 attempts per 15 mins
  if (!rateLimit.success) {
    const errorMsg = encodeURIComponent(rateLimit.error || 'Terlalu banyak percobaan login.')
    redirect(`/admin/login?error=${errorMsg}`)
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = loginSchema.safeParse({ email, password })
  if (!validation.success) {
    const errorMsg = encodeURIComponent(validation.error.issues[0].message)
    redirect(`/admin/login?error=${errorMsg}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  })

  if (error) {
    redirect('/admin/login?error=Email%20atau%20password%20salah')
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function loginCompany(formData: FormData) {
  const ip = await getClientIp()
  const rateLimit = checkRateLimit('login_company', ip, 5, 15 * 60 * 1000) // 5 attempts per 15 mins
  if (!rateLimit.success) {
    const errorMsg = encodeURIComponent(rateLimit.error || 'Terlalu banyak percobaan login.')
    redirect(`/perusahaan/login?error=${errorMsg}`)
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = loginSchema.safeParse({ email, password })
  if (!validation.success) {
    const errorMsg = encodeURIComponent(validation.error.issues[0].message)
    redirect(`/perusahaan/login?error=${errorMsg}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  })

  if (error) {
    redirect('/perusahaan/login?error=Email%20atau%20password%20salah')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
