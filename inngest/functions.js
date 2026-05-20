import { inngest } from "./client"
import { prisma } from '@/lib/prisma'

export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-create', triggers: [{ event: 'clerk/user.created' }] },
  async ({ event, step }) => {
    await step.run('create-user-in-db', async () => {
      const { data } = event
      const email = data.email_addresses?.[0]?.email_address

      if (!email) {
        throw new Error(`Cannot sync user ${data.id}: email is undefined`)
      }

      await prisma.user.create({
        data: {
          id: data.id,
          email,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url ?? null,
        },
      })
    })

    return { success: true }
  }
)

export const syncUserUpdate = inngest.createFunction(
  { id: 'sync-user-update', triggers: [{ event: 'clerk/user.updated' }] },
  async ({ event, step }) => {
    await step.run('update-user-in-db', async () => {
      const { data } = event
      const email = data.email_addresses?.[0]?.email_address

      await prisma.user.update({
        where: { id: data.id },
        data: {
          email,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url ?? null,
        },
      })
    })
  }
)

export const syncUserDelete = inngest.createFunction(
  { id: 'sync-user-delete', triggers: [{ event: 'clerk/user.deleted' }] },
  async ({ event, step }) => {
    await step.run('delete-user-from-db', async () => {
      const { data } = event

      try {
        await prisma.user.delete({
          where: { id: data.id },
        })
      } catch (error) {
        if (error.code === 'P2025') {
          console.log(`User ${data.id} not found, skipping delete.`)
          return
        }
        throw error
      }
    })
  }
)