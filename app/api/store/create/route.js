//create store to allow user add their products to the store

import { imagekit } from "@/lib/imagekit"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function POST(request){
    try {
        const {userId} = await auth()
        if(!userId){
            return NextResponse.json({error:"unauthorized user"}, {status: 401})
        }
        const formData = await request.formData()
        // get data from the form 
        const name = formData.get('name')
        const username = formData.get('username')
        const description = formData.get('description')
        const email = formData.get('email')
        const contact = formData.get('contact')
        const address = formData.get('address')
        const image = formData.get('image')

        if (!name || !username || !description || !email || !contact || !address || !image) {
            return NextResponse.json({error: "Missing store info"}, {status: 400})
        }

        // check if user is already stored or registered
        const existingStore = await prisma.store.findFirst({
            where: {userId: userId}
        
        })

        if(existingStore){
            return NextResponse.json({error:"you have a registered store", status:existingStore.status}, {status: 409})
        }


        // check for existing user 

        const existingUser = await prisma.store.findFirst({
            where: {username: username.toLowerCase()}
        })

        if(existingUser){
            return NextResponse.json({error: "username already taken"}, {status: 409})
        }
        //image upload to imagekit
        const buffer = Buffer.from(await image.arrayBuffer())
        const response = await imagekit.upload({
            file: buffer,
            fileName: image.name, 
            folder: "logos"
        })

        const optimizedImage = imagekit.url({
            path:response.filePath,
            transformation: [
                {quality: 'auto'},
                {format: 'webp'},
                {width: 512}
            ]
        })

        //store in database
        const newstore = await prisma.store.create({
            data: {
                userId, 
                name,
                description,
                username: username.toLowerCase(),
                email, 
                contact,
                address,
                logo: optimizedImage
            }
        })

        return NextResponse.json({message: "store created",  storeId: newstore.id}, {status: 201})

    }catch (error) {
        console.error("POST Store Error:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }

}

//check if the user already registered a store if yes then send status of store 

export async function GET(request){
    try {
        const {userId} = await auth()
        if(!userId){
            return NextResponse.json({error:"unauthorized user"}, {status: 401})
        }
        // check if a user already registered a store
        const store = await prisma.store.findFirst({
            where: {userId: userId}
        })
        // if user already registered a store 
        if(store){
            return NextResponse.json({
                isRegistered:true,
                status: store.status,
                store: {
                    name: store.name,
                    username: store.username
                }}, {status: 200})
        }
        return NextResponse.json({ isRegistered: false, message: "Not registered" }, { status: 200 })

    }catch(error){
        console.error("Get store error", error)
        return NextResponse.json({error:error.message || "Internal Server Error"}, {status: 500})


    }

}