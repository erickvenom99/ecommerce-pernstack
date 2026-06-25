import authSeller from '@/middleware/authSeller';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request){
    const {userId} = await auth()
    const store = await authSeller(userId)
    if(!store){
        return NextResponse.json({error: 'unathorized user'}, {status: 403})
    }

    const formData = await request.formData()
    const file = formData.get('image')

    if(!file){
        return NextResponse.json({error: 'No file found, please upload file'}, {status: 400})
    }

    const byte = await file.arrayBuffer()
    const buffer = Buffer.from(byte)

    const imagePart = {
        inlineData: {
            data: buffer.toString('base64'),
            mimeType: file.type
        }
    }
    try {
            const response = await ai.models.generateContent({
                model:'gemini-2.5-flash',
                contents: [
                    imagePart,
                    'Analyze this image and generate an SEO-optimized product name and a clean description for an e-commerce catalog.'
                ],
                config: {
                responseMimeType: 'application/json',
                responseSchema: {
                type: 'OBJECT',
                properties: {
                    name: { type: 'STRING', description: 'Catchy product title, max 60 characters.' },
                    description: { type: 'STRING', description: 'Engaging, descriptive summary of features.' }
                },
                required: ['name', 'description']
                }
            }
            })

            const generatedData = JSON.parse(response.text);
            return NextResponse.json(generatedData, { status: 200 });

        } catch(error) {
            console.error('Gemini secure processing error:', error);
            return NextResponse.json({ error: 'AI failed to process image' }, { status: 500 });

        }

}