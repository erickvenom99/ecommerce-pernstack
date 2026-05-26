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


//inngest function to delete coupon on expire
export const deleteCouponOnExpiry = inngest.createFunction(
  { id: 'delete-coupon-on-expiry', triggers: [{ event: 'app.coupon.expired' }] },
  async ({ event, step }) => {
    const { data } = event;
    
   
    const targetDate = data.expired_at; 
    
    if (!targetDate) {
      console.error(`[Inngest] Aborting workflow: Missing 'expired_at' field for coupon code: ${data.code}`);
      return;
    }

    const dateOnlyString = targetDate.includes('T') ? targetDate.split('T')[0] : targetDate;
    const expiryDate = new Date(`${dateOnlyString}T00:00:00`); 

    if (isNaN(expiryDate.getTime())) {
      console.error(`[Inngest] Aborting workflow: String '${targetDate}' failed to parse into a valid Date object.`);
      return;
    }


    await step.sleepUntil('wait-for-expiry', expiryDate);

    await step.run('delete-coupon-from-database', async () => {
      await prisma.coupon.deleteMany({
        where: { code: data.code }
      });
    });
  }
);