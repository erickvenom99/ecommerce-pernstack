import {inngest} from "./client"
import { prisma }from '@/lib/prisma'



//inngest function to save a user to a user database

export const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-create',
    event: 'clerk/user.created'
    },
    async ({event})=>{
        const {data} =  event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0].email_address,
                name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                image: data.image_url
            }
        })
    }
)




// function to update user in database
export const syncUserUpdate = inngest.createFunction(
    {id: 'sync-user-update',
    event: 'clerk/user.updated'
    },
    async ({event})=>{
        const {data} =  event
        await prisma.user.update({
            where: {id: data.id,},
            data: {
                email: data.email_addresses[0].email_address,
                name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                image: data.image_url
            }
        })
    }
)

// function to delete user in database
export const syncUserDelete = inngest.createFunction(
    {id: 'sync-user-delete',
    event: 'clerk/user.deleted'
    },
    async ({ event }) => {
        const { data } = event;

        try {
            await prisma.user.delete({
                where: { id: data.id },
            });
        } catch (error) {
            // Note: Use 'P2025' (capital P) for the Prisma record not found error
            if (error.code === 'P2025') {
                console.log(`User ${data.id} not found in Database, skipping delete.`);
                return;
            }
            throw error;
        }
    }
);


