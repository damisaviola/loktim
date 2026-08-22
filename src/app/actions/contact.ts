'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserSession } from './auth'
import { contactFormSchema } from '@/lib/validations/contact'
import { getClientIp, checkRateLimit } from '@/lib/rate-limit'
import DOMPurify from '@/lib/sanitize'

export async function submitContactMessageAction(rawInput: {
  name: string
  email: string
  phone?: string | null
  organization?: string | null
  category?: string
  subject: string
  message: string
}) {
  try {
    const ip = await getClientIp()
    const rateLimit = checkRateLimit('contact_message', ip, 5, 10 * 60 * 1000) // 5 messages per 10 mins
    if (!rateLimit.success) {
      return { success: false, error: rateLimit.error }
    }

    const validationResult = contactFormSchema.safeParse({
      ...rawInput,
      category: rawInput.category || "general"
    })

    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map(i => i.message).join(', ')
      return { success: false, error: errorMsg }
    }

    const data = validationResult.data
    const safeName = DOMPurify.sanitize(data.name.trim())
    const safeEmail = data.email.trim().toLowerCase()
    const safePhone = data.phone ? DOMPurify.sanitize(data.phone.trim()) : null
    const safeOrg = data.organization ? DOMPurify.sanitize(data.organization.trim()) : null
    const safeCategory = DOMPurify.sanitize(data.category.trim())
    const safeSubject = DOMPurify.sanitize(data.subject.trim())
    const safeMessage = DOMPurify.sanitize(data.message.trim())

    // Generate unique Ticket ID: MSG-XXXXXX
    let ticketId = `MSG-${Math.floor(100000 + Math.random() * 900000)}`
    
    // Ensure uniqueness
    const existing = await prisma.contactMessage.findUnique({
      where: { ticketId }
    })
    if (existing) {
      ticketId = `MSG-${Math.floor(100000 + Math.random() * 900000)}`
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        ticketId,
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        organization: safeOrg,
        category: safeCategory,
        subject: safeSubject,
        message: safeMessage,
        status: 'unread'
      }
    })

    revalidatePath('/admin/contacts')

    return { 
      success: true, 
      ticketId: newMessage.ticketId 
    }
  } catch (error: any) {
    console.error('Failed to submit contact message:', error)
    return { success: false, error: 'Terjadi kesalahan sistem saat mengirim pesan. Silakan coba lagi.' }
  }
}

export async function getContactMessagesAction() {
  try {
    const user = await getUserSession()
    if (!user) throw new Error('Unauthorized')

    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString()
    }))
  } catch (error: any) {
    console.error('Failed to get contact messages:', error)
    return []
  }
}

export async function updateContactMessageStatusAction(id: string, status: string, replyNotes?: string) {
  try {
    const user = await getUserSession()
    if (!user) return { success: false, error: 'Unauthorized' }

    await prisma.contactMessage.update({
      where: { id },
      data: { 
        status,
        ...(replyNotes !== undefined ? { replyNotes: DOMPurify.sanitize(replyNotes) } : {})
      }
    })

    revalidatePath('/admin/contacts')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to update contact message status:', error)
    return { success: false, error: 'Gagal memperbarui status pesan' }
  }
}

export async function deleteContactMessageAction(id: string) {
  try {
    const user = await getUserSession()
    if (!user) return { success: false, error: 'Unauthorized' }

    await prisma.contactMessage.delete({
      where: { id }
    })

    revalidatePath('/admin/contacts')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete contact message:', error)
    return { success: false, error: 'Gagal menghapus pesan' }
  }
}
