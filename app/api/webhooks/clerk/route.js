import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { inngest } from '@/inngest/client'

export async function POST(req) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  const headerPayload = await headers()

  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id'),
    'svix-timestamp': headerPayload.get('svix-timestamp'),
    'svix-signature': headerPayload.get('svix-signature'),
  }

  const payload = await req.text()
  const wh = new Webhook(secret)

  let event
  try {
    event = wh.verify(payload, svixHeaders)
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Clerk event type:', event.type)
  console.log('Clerk event data keys:', Object.keys(event.data))

  await inngest.send({
    name: `clerk/${event.type}`,
    data: event.data,
  })

  return Response.json({ received: true }, { status: 200 })
}