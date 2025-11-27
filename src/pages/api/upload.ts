import type { APIRoute } from 'astro';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  console.log('Upload request Content-Type:', request.headers.get('Content-Type'));
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No file uploaded'
      }), { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Only image files are allowed'
      }), { status: 400 });
    }

    // Environment variables
    const R2_ACCOUNT_ID = import.meta.env.CLOUDFLARE_R2_ACCOUNT_ID; // Not used directly with S3Client if endpoint is full
    const R2_ACCESS_KEY_ID = import.meta.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const R2_SECRET_ACCESS_KEY = import.meta.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const R2_BUCKET_NAME = import.meta.env.CLOUDFLARE_R2_BUCKET_NAME;
    const R2_ENDPOINT = import.meta.env.CLOUDFLARE_R2_ENDPOINT;
    const R2_PUBLIC_URL = import.meta.env.CLOUDFLARE_R2_PUBLIC_URL;

    if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_ENDPOINT || !R2_PUBLIC_URL) {
      console.error('Missing R2 configuration');
      return new Response(JSON.stringify({
        success: false,
        message: 'Server configuration error'
      }), { status: 500 });
    }

    const S3 = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    // Generate a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `uploads/${timestamp}-${randomString}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    await S3.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    }));

    const url = `${R2_PUBLIC_URL}/${filename}`;

    return new Response(JSON.stringify({
      success: true,
      url: url
    }), { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Upload failed: ' + (error as Error).message
    }), { status: 500 });
  }
};
