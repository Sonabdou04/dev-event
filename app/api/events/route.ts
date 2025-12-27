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

    let tags;
    let agenda;
    
    try {
      tags = JSON.parse(formData.get('tags') as string);
      agenda = JSON.parse(formData.get('agenda') as string);
    } catch(e) {
      return NextResponse.json({message: `Invalid tags or agenda format: ${e}`}, {status: 400});
    }

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

    // Prepare event data
    const eventData = {
      title: event.title?.trim() || '',
      description: event.description?.trim() || '',
      overview: event.overview?.trim() || '',
      image: (uploadResult as any).secure_url,
      venue: event.venue?.trim() || '',
      location: event.location?.trim() || '',
      date: event.date || '',
      time: event.time || '',
      mode: event.mode || 'online',
      audience: event.audience?.trim() || '',
      organizer: event.organizer?.trim() || '',
      tags: tags || [],
      agenda: agenda || [],
    };

    // Create event - validation errors will be caught by outer catch block
    const createdEvent = await (Event as any).create(eventData);

    return NextResponse.json({message: "Event created successfully", createdEvent}, {status: 201});

  } catch (error: any) {
    console.error('Error creating event:', {
      name: error?.name,
      message: error?.message,
      errors: error?.errors,
      code: error?.code,
      keyPattern: error?.keyPattern,
      stack: error?.stack
    });
    
    // Handle Mongoose validation errors (from schema validators)
    if (error?.name === 'ValidationError' && error.errors) {
      const errors: Record<string, string> = {};
      
      // Iterate through all validation errors
      for (const key in error.errors) {
        if (error.errors.hasOwnProperty(key)) {
          const err = error.errors[key];
          // Get the error message from the validation error
          // Mongoose validation errors have a 'message' property
          errors[key] = err.message || err.msg || `Validation error for ${key}`;
        }
      }
      
      return NextResponse.json({
        message: 'Validation failed',
        errors
      }, {status: 400});
    }

    // Handle CastError (invalid data type)
    if (error?.name === 'CastError') {
      return NextResponse.json({
        message: `Invalid data format for ${error.path}`,
        errors: { [error.path]: `Invalid ${error.path} format` }
      }, {status: 400});
    }

    // Handle duplicate key errors (e.g., duplicate slug)
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return NextResponse.json({
        message: `${field} already exists`,
        errors: { [field]: `${field} must be unique` }
      }, {status: 400});
    }

    // Handle pre-save hook errors (like from normalizeDate, normalizeTime in event.model.ts)
    // These are thrown as regular Error objects, not ValidationError
    if (error?.message) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('invalid date')) {
        return NextResponse.json({
          message: error.message,
          errors: { date: error.message }
        }, {status: 400});
      }
      
      if (errorMessage.includes('invalid time')) {
        return NextResponse.json({
          message: error.message,
          errors: { time: error.message }
        }, {status: 400});
      }
    }

    // For any other errors, return a generic error response
    // Include error details in development but not in production
    return NextResponse.json({
      message: `Failed to create event: ${error?.message || String(error)}`,
      ...(process.env.NODE_ENV === 'development' && {
        error: String(error),
        errorName: error?.name,
        errorCode: error?.code
      })
    }, {status: 500});
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
