import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Event } from "../../../lib/database";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();

    let { slug } = await params;
    slug = slug.trim().toLowerCase();

    const event = await Event.findOne({ slug });

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
