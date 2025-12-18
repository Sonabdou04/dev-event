"use server"
import { Booking } from "../database";
import connectDB from "../mongodb"
import { auth } from "../auth";
import { headers } from "next/headers";
import type { EventType } from "../constants";

export const createBooking = async ({eventId}: {eventId: string}) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    const userId = session?.user?.id as string | undefined;

    if (!session || !userId) {
      return { success: false, unauthorized: true }
    }

    try {
      await connectDB();
      await Booking.create({ eventId, userId })
      return { success: true, alreadyBooked: false }
    } catch (error: any) {
      if (error?.code === 11000) {
        return { success: true, alreadyBooked: true }
      }
      return { success: false }
    }
}

export const getUserBookedEvents = async (): Promise<EventType[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id as string | undefined;

  if (!session || !userId) {
    return [];
  }

  try {
    await connectDB();

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .populate("eventId")
      .lean();

    const events: EventType[] = bookings
      .map((booking: any) => {
        const event = booking.eventId as any;

        if (!event) return null;

        const mapped: EventType = {
          title: event.title,
          slug: event.slug,
          image: event.image,
          location: event.location,
          date: event.date,
          time: event.time,
        };

        return mapped;
      })
      .filter((e: EventType | null): e is EventType => e !== null);

    return events;
  } catch (error) {
    console.error(error);
    return [];
  }
};