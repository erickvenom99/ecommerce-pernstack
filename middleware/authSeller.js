import { prisma } from "@/lib/prisma"

const authSeller = async(userId) => {
    try {
        if(!userId){
            return null
        }
        const store = await prisma.store.findUnique({
            where: {userId: userId},
        })
        if(!store) {
            return null
        }
        if(store.status === 'approved' || store.status === 'pending' ){
                return store
            
        }
        return null

    }catch(error) {
        console.error(error)
        return null
    }

}

export default authSeller