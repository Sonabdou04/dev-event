import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Event } from "../../../lib/database";
import cloudinary from "cloudinary";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();

    let { slug } = await params;
    slug = slug.trim().toLowerCase();

    const event = await (Event as any).findOne({ slug });

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Event fetched successfully`, event },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: `Failed to fetch event`, error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const formData = await req.formData();

    let { slug } = await params;
    slug = slug.trim().toLowerCase();

    const existingEvent = await (Event as any).findOne({ slug });
    if (!existingEvent) {
      return NextResponse.json(
        { message: `Event with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    let eventData: any;
    try {
      eventData = Object.fromEntries(formData.entries());
    } catch(e) {
      return NextResponse.json({message: `Invalid form data ${e}`}, {status: 400});
    }

    const file = formData.get('image') as File;

    // If a new image is uploaded, upload it to Cloudinary
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
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
      eventData.image = (uploadResult as any).secure_url;
    } else {
      // Keep the existing image if no new image is uploaded
      eventData.image = existingEvent.image;
    }

    // Parse JSON fields
    let tags, agenda;
    try {
      if (formData.get('tags')) {
        tags = JSON.parse(formData.get('tags') as string);
        eventData.tags = tags;
      }
      if (formData.get('agenda')) {
        agenda = JSON.parse(formData.get('agenda') as string);
        eventData.agenda = agenda;
      }
    } catch(e) {
      return NextResponse.json({message: `Invalid tags or agenda format: ${e}`}, {status: 400});
    }

    // Prepare event data with proper formatting
    const newTitle = eventData.title?.trim() || existingEvent.title;
    const titleChanged = newTitle !== existingEvent.title;
    
    // Generate new slug if title changed (same logic as in event.model.ts pre-save hook)
    let newSlug = existingEvent.slug;
    if (titleChanged) {
      newSlug = newTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    const updateData = {
      title: newTitle,
      description: eventData.description?.trim() || existingEvent.description,
      overview: eventData.overview?.trim() || existingEvent.overview,
      image: eventData.image || existingEvent.image,
      venue: eventData.venue?.trim() || existingEvent.venue,
      location: eventData.location?.trim() || existingEvent.location,
      date: eventData.date || existingEvent.date,
      time: eventData.time || existingEvent.time,
      mode: eventData.mode || existingEvent.mode,
      audience: eventData.audience?.trim() || existingEvent.audience,
      organizer: eventData.organizer?.trim() || existingEvent.organizer,
      tags: tags || existingEvent.tags,
      agenda: agenda || existingEvent.agenda,
      slug: newSlug, // Update slug if title changed
    };

    // If slug changed, we need to update by the old slug, but the new slug might conflict
    // So we need to check if the new slug already exists (unless it's the same event)
    if (titleChanged && newSlug !== existingEvent.slug) {
      const slugExists = await (Event as any).findOne({ slug: newSlug });
      if (slugExists && slugExists._id.toString() !== existingEvent._id.toString()) {
        return NextResponse.json({
          message: 'An event with this title already exists',
          errors: { title: 'An event with this title already exists' }
        }, {status: 400});
      }
    }

    // Update the event - if slug changed, we update by old slug
    const updatedEvent = await (Event as any).findOneAndUpdate(
      { slug }, // Use old slug to find the document
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { message: "Event updated successfully", event: updatedEvent },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error updating event:', {
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
    return NextResponse.json({
      message: `Failed to update event: ${error?.message || String(error)}`,
      ...(process.env.NODE_ENV === 'development' && {
        error: String(error),
        errorName: error?.name,
        errorCode: error?.code
      })
    }, {status: 500});
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();

    let { slug } = await params;
    slug = slug.trim().toLowerCase();

    const event = await (Event as any).findOne({ slug });
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (event.image) {
      try {
        const publicId = event.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.v2.uploader.destroy(`EventsHub/${publicId}`);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with event deletion even if image deletion fails
      }
    }

    await (Event as any).findOneAndDelete({ slug });

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: `Failed to delete event: ${error}` },
      { status: 500 }
    );
  }
}
