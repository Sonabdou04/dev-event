"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBooking } from "../app/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({eventId}: {eventId:string}) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { success, unauthorized, alreadyBooked } = await createBooking({ eventId });
    console.log(success, unauthorized, alreadyBooked);

    if (unauthorized) {
      toast.error("You need to be logged in to book this event.");
      router.push("/login");
      setLoading(false);
      return;
    }

    if (success) {
      if (alreadyBooked) {
        toast.info("You already booked this event.");
        setLoading(false);
        return;
      }
      setSubmitted(true);
      posthog.capture("event_booked", {eventId});
    } else {
      console.error("Failed to book this event");
      posthog.captureException("Failed to book this event");
      toast.error("Failed to book this event");
      
    }

    setLoading(false);
  };
  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for booking the event!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="button-submit"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book now"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
