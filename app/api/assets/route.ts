import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

export async function GET(request: Request) {
    try {
        // const { searchParams } = new URL(request.url)
        // const searchTerm = searchParams.get('search') || ''
        
        const data = await cloudinary.search
            .expression()
            .execute()
        
        return NextResponse.json(data.resources)
    } catch (error) {
        console.error('Error fetching assets:', error)
        return NextResponse.json(
            { error: 'Error fetching assets' },
            { status: 500 }
        )
    }
} 