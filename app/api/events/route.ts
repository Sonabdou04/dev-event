import { NextRequest, NextResponse } from "next/server";
import { Event } from "../../lib/database";
import connectDB from "../../lib/mongodb";
import cloudinary from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch(e) {
      return NextResponse.json({message: `Invalid form data ${e}`}, {status: 400});
    }

    const file = formData.get('image') as File;
    if (!file) {
      return NextResponse.json({message: `No image uploaded`}, {status: 400});
    }
    let tags = JSON.parse(formData.get('tags') as string);
    let agenda = JSON.parse(formData.get('agenda') as string);
    const arayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'EventsHub',
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    event.image = (uploadResult as any).secure_url;

    const createdEvent = await (Event as any).create({
      ...event,
      tags,
      agenda,
    });

    return NextResponse.json({message: "Event created successfully", createdEvent}, {status: 201});

  } catch (error) {

    return NextResponse.json({message: `Failed to create event ${error}`}, {status: 500});

  }
    
}

export async function GET() {
  try {
    await connectDB();
    const events = await (Event as any).find().sort({createdAt: -1});
    return NextResponse.json({message: "Events fetched successfully", events}, {status: 200});
  } catch (error) {
    return NextResponse.json({message: `Failed to fetch events ${error}`}, {status: 500});
  }
}
