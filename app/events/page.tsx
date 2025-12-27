import EventCard from "../../components/EventCard";
import { IEvent } from "../lib/database";
import { cacheLife, cacheTag } from "next/cache";

export default async function page() {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
  const {events} = await response.json();
  return (
    <section>
      <h1 className="text-center">
        Upcoming Developer Events <br /> Find one and reserve your spot
      </h1>
      <p className="text-center mt-5">
        Browse the full schedule and book the events you want to attend.
      </p>

      <div className="mt-10 space-y-5">
                <h3 className="flex items-center gap-3 text-lg md:text-xl font-semibold tracking-tight text-white">
          <span className="inline-block h-px w-6 md:w-8 bg-emerald-500/70" />
          <span>All Events</span>
        </h3>
        <ul className="events">
          {events && events.length > 0 ? events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          )) : <p>No events found</p>}
        </ul>
      </div>
    </section>
  );
}
