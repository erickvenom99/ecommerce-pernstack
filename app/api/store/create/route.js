// create store to allow user add their products to the store
import imagekit from "@/lib/imagekit"
import { toFile } from "@imagekit/nodejs";
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// =================================================================
// POST: REGISTER A BRAND NEW SELLER STOREFRONT
// =================================================================
export async function POST(request){
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
        }

        const formData = await request.formData()
        
        // Extract field payloads cleanly
        const name = formData.get('name')
        const username = formData.get('username')
        const description = formData.get('description')
        const email = formData.get('email')
        const contact = formData.get('contact')
        const address = formData.get('address')
        const image = formData.get('image')

        if (!name || !username || !description || !email || !contact || !address || !image) {
            return NextResponse.json({ error: "Missing store info" }, { status: 400 })
        }

        // Check if user already owns an explicit storefront instance
        const existingStore = await prisma.store.findFirst({
            where: { userId: userId }
        })

        if (existingStore) {
            return NextResponse.json({ error: "You already have a registered store", status: existingStore.status }, { status: 409 })
        }

        // Verify global username claim availability
        const existingUser = await prisma.store.findFirst({
            where: { username: username.toLowerCase() }
        })

        if (existingUser) {
            return NextResponse.json({ error: "Username already taken" }, { status: 409 })
        }

        // Process standard image binary buffers without heavy base64 conversions
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer)
        const safeFileName = `logo-${Date.now()}-${username.replace(/[^a-zA-Z0-9]/g, "")}.jpg`;
        const imageKitCompatibleFile = await toFile(buffer, safeFileName);
    
        const uploadResult = await imagekit.files.upload({
            file: imageKitCompatibleFile,
            fileName: safeFileName,
            folder: "logos"
        })
        
        const filePath = uploadResult?.filePath
        
        if (!filePath) {
            console.error("-> IMAGEKIT uploaded, but no valid filePath was returned:", uploadResult);
            return NextResponse.json({ error: "Invalid response metadata from media server" }, { status: 502 });
        }

        // FIXED: Swapped response.filePath to the actual local variable filePath
        const optimizedImage = String(imagekit.helper.buildSrc({
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            src: filePath, 
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: 512 }
            ]
        }))

        console.log("-> TARGET NEON LINK SAVING:", optimizedImage);

        // Commit transaction data securely to Neon with explicit string casts
        const newstore = await prisma.store.create({
            data: {
                userId: String(userId), 
                name: String(name).trim(),
                description: String(description).trim(),
                username: String(username).toLowerCase().trim(),
                email: String(email).trim(),
                contact: String(contact).trim(),
                address: String(address).trim(),
                logo: String(optimizedImage)
            }
        })

        return NextResponse.json({ message: "Store created successfully", storeId: newstore.id }, { status: 201 })

    } catch (error) {
        console.error("POST Store Error Diagnostics:")
        console.error("Error name:", error?.name)
        console.error("Error message:", error?.message)
        console.error("Error stack:", error?.stack)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}

// =================================================================
// GET: CHECK ACTIVE REGISTRATION AND STATUS STATES FOR ACCOUNT
// =================================================================
export async function GET(request){
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized user" }, { status: 401 })
        }

        const store = await prisma.store.findFirst({
            where: { userId: userId }
        })

        if (store) {
            return NextResponse.json({
                isRegistered: true,
                status: store.status,
                store: {
                    name: store.name,
                    username: store.username
                }
            }, { status: 200 })
        }
        
        return NextResponse.json({ isRegistered: false, message: "Not registered" }, { status: 200 })

    } catch (error) {
        console.error("Get store error dashboard:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}