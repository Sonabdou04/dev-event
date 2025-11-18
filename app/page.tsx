import ExploreBtn from "../components/ExploreBtn";
import EventCard from "../components/EventCard";
import { IEvent } from "./lib/database";

export default async function page() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
  const {events} = await response.json();
  return (
    <section>
      <h1 className="text-center">
        The Hub of Every Dev <br /> Do Not Miss Any Event With Us
      </h1>
      <p className="text-center mt-5">
        Meetups, Hackathons, Workshops, and More
      </p>
      <ExploreBtn />
      <div className="mt-10 space-y-5">
        <h3>Featured Events</h3>
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
