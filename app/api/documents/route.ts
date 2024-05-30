import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files found in request" }, { status: 400 });
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File size exceeds 10MB" }, { status: 400 });
      }
 
      const Body = await file.arrayBuffer() as Buffer;
      await s3.send(new PutObjectCommand({ Bucket, Key: file.name, Body }));

      // Get the URL of the uploaded image
      const imageUrl = `https://${Bucket}.s3.amazonaws.com/${file.name}`;
      imageUrls.push(imageUrl);
    }

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}
