import prisma from "@/app/libs/prismadb";

export default async function getListings(){
    
    try{
        const listings = await prisma.listing.findMany({
            orderBy:{
                createdAt :'desc'
            }
        });
        // we change the listing to a safelisting because we have to change the type of date to String
        const safeListings = listings.map((listing)=>({
            ...listing,
            createdAt : listing.createdAt.toISOString()
        
        }))

        return safeListings;
    }catch (error: any){
        throw new Error(error);
    }
}