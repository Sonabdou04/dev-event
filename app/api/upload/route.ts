import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";



export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary upload using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const upload = cloudinary.v2.uploader.upload_stream(
        {
          folder: "user-avatars",
          transformation: [
            { width: 400, height: 400, crop: "fill" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      upload.end(buffer); // Send the file buffer to Cloudinary
    });

    return NextResponse.json({
      url: (uploadResult as any).secure_url,
      publicId: (uploadResult as any).public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
