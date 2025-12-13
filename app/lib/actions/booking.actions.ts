"use server"
import { Booking } from "../database";
import connectDB from "../mongodb"
import { auth } from "../auth";
import { headers } from "next/headers";

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