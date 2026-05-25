import  imagekit  from "@/lib/imagekit";
import { prisma } from "@/lib/prisma";
import authSeller from "@/middleware/authSeller";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ==========================================
// POST: ADD A NEW PRODUCT TO A STORE
// ==========================================
export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const storeInfo = await authSeller(userId);
        if (!storeInfo) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        if (storeInfo.status !== "approved") {
            return NextResponse.json({
                message: "Your store application is under review, you cannot add product until approved"
            },
                { status: 403 })
        }

        const formData = await request.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const images = formData.getAll('images');

        // 1. HARDENED VALIDATION: Safely parse numbers and catch NaN mutations
        const mrp = Number(formData.get('mrp'));
        const price = Number(formData.get('price'));

        // Basic structural presence verification
        if (!name || !description || !category || images.length < 1) {
            return NextResponse.json({ error: "Missing required textual or image product details" }, { status: 400 });
        }

        // 2. MATH CHECK: Ensure values are actual positive numbers before Prisma touches them
        if (isNaN(mrp) || mrp <= 0 || isNaN(price) || price <= 0) {
            return NextResponse.json({ error: "MRP and Price must be valid numbers greater than zero" }, { status: 400 });
        }

        // Uploading images concurrently to ImageKit
        const imagesUrl = await Promise.all(
            images.map(async (image) => {
                const arrayBuffer = await image.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer);
                const safeFileName = `logo-${Date.now()}-${name.replace(/[^a-zA-Z0-9]/g, "")}.jpg`;
                const imageKitCompatibleFile = await toFile(buffer, safeFileName);

                const uploadResult = await imagekit.files.upload({
                    file: imageKitCompatibleFile,
                    fileName: safeFileName,
                    folder: "products",
                });
                const filePath = uploadResult?.filePath

                if (!filePath) {
                    console.error("-> IMAGEKIT uploaded, but no valid filePath was returned:", uploadResult);
                    throw new Error("Invalid asset response metadata from media storage server");
                }

                return String(imagekit.helper.buildSrc({
                    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
                    src: filePath,
                    transformation: [
                        { quality: 'auto' },
                        { format: 'webp' },
                        { width: '1024' }
                    ]
                }));
            })
        );

        // Commit finalized clean entity to Postgres
        const product = await prisma.product.create({
            data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imagesUrl,
                storeId: storeInfo.id
            }
        });

        return NextResponse.json({ message: "Product added successfully", productId: product.id }, { status: 201 });

    } catch (error) {
        console.error('Post product operation encountered a failure:', error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// ==========================================
// GET: FETCH ALL PRODUCTS FOR A SELLER
// ==========================================
export async function GET(request) {
    try {
        const { userId } = await auth();

        const storeInfo = await authSeller(userId);
        if (!storeInfo) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            where: { storeId: storeInfo.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ message: "Products found successfully", products }, { status: 200 });

    } catch (error) {
        console.error('Product discovery sequence failed:', error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}