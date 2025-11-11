import ExploreBtn from "@/components/ExploreBtn";
import React from "react";
import EventCard from "@/components/EventCard";

export default function page() {
  const events = [
    {
      title: "Event 1",
      image: "/images/event1.png",
    },
    {
      title: "Event 2",
      image: "/images/event2.png",
    },
  ];
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
          {events.map((event) => (
            <li key={event.title} className="list-none">
              <EventCard title={event.title} image={event.image} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
