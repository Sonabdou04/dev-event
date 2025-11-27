"use client";
import { useState } from "react";
import { createBooking } from "../app/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({eventId, slug}: {eventId:string, slug: string}) => {
  console.log(eventId, slug)
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success } = await createBooking({ eventId, slug, email });
    if (success) {
      setSubmitted(true);
      setEmail("");
      posthog.capture("event_booked", {eventId, slug, email});
    } else {
      console.error("Failed to book this event");
      posthog.captureException("Failed to book this event");
    }
  };
  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for booking the event!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="button-submit">
              Book now
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
