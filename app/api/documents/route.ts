import { NextRequest, NextResponse } from "next/server";




import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.AMPLIFY_BUCKET;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});





// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
    try{
        const formData = await request.formData();
        const files = formData.getAll("file") as File[];

        if(!files){
            return NextResponse.json({error: "No files found in request"},{status: 400});
        }
        
        const response = await Promise.all(
            files.map(async (file) => {
                if (file.size > 10 * 1024 * 1024) {
                    return NextResponse.json({error: "File size exceeds 10MB"}, {status: 400});
                }
                
                const Body = (await file.arrayBuffer()) as Buffer;
                await s3.send(new PutObjectCommand({ Bucket, Key: file.name, Body }));
                
                // Get the URL of the uploaded image
                const imageUrl = `https://${Bucket}.s3.amazonaws.com/${file.name}`;
                return imageUrl;
            })
        );

        return NextResponse.json(response);

    } catch(error) {
        return NextResponse.json({error: "Error uploading file"});
    }
}

// endpoint to get the list of files in the bucket
export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  return NextResponse.json(response?.Contents ?? []);
}

