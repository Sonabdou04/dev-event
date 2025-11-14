import ExploreBtn from "../components/ExploreBtn";
import React from "react";
import EventCard from "../components/EventCard";
import { EVENTS } from "./lib/constants";

export default function page() {
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
          {EVENTS.map((event) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
