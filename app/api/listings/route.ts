import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {


    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    try {
        const body = await request.json();

        const {
            title,
            description,
            images,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            location,
            adresse,
            price
        } = body;

        // Check if all required fields are present
        if (!title || !description || !images || !category || !roomCount || !bathroomCount || !guestCount || !location || !adresse || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate the price
        const parsedPrice = parseInt(price, 10);
        if (isNaN(parsedPrice)) {
            return NextResponse.json({ error: "Invalid price" }, { status: 400 });
        }

        // Create the listing
        const listing = await prisma.listing.create({
            data: {
                title,
                description,
                images,
                category,
                roomCount,
                bathroomCount,
                guestCount,
                locationValue: location.value,
                adresse,
                price: parsedPrice,
                userId: currentUser.id
            }
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error("Error creating listing:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
