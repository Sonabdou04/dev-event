import ExploreBtn from "../components/ExploreBtn";
import EventCard from "../components/EventCard";
import Features, { ChromaItem } from "../components/Features";
import Link from "next/link";
import { IEvent } from "./lib/database";
import { cacheLife, cacheTag } from "next/cache";

export default async function page() {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`
  );
  const { events } = await response.json();

  const featureItems: ChromaItem[] = [
    {
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=280&fit=crop",
      title: "Book Events Instantly",
      subtitle: "Reserve your spot in seconds",
      handle: "@quickbook",
      borderColor: "#4F46E5",
      gradient: "linear-gradient(145deg,#4F46E5,#000)",
    },
    {
      image:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=280&fit=crop",
      title: "See Latest Events",
      subtitle: "Discover new meetups & workshops",
      handle: "@latest",
      borderColor: "#10B981",
      gradient: "linear-gradient(210deg,#10B981,#000)",
    },
    {
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=280&fit=crop",
      title: "Stay Connected",
      subtitle: "Never miss an important event",
      handle: "@connected",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg,#F59E0B,#000)",
    },
  ];

  return (
    <>
      <section>
        <h1 className="text-center">
        The Hub of Every Dev <br /> Do Not Miss Any Event With Us
      </h1>
      <p className="text-center mt-5">
        Meetups, Hackathons, Workshops, and More
      </p>
      <ExploreBtn />
      <div className="mt-16 space-y-6">
        <h3 className="flex items-center gap-3 text-lg md:text-xl font-semibold tracking-tight text-white">
          <span className="inline-block h-px w-6 md:w-8 bg-emerald-500/70" />
          <span> Fast booking, fresh events, and effortless sharing.</span>
        </h3>
        <div className="features-wrapper flex items-center">
          <Features items={featureItems} />
        </div>
      </div>
      <div className="mt-10 space-y-5" id="events">
        <h3 className="flex items-center gap-3 text-lg md:text-xl font-semibold tracking-tight text-white">
          <span className="inline-block h-px w-6 md:w-8 bg-emerald-500/70" />
          <span>Featured Events</span>
        </h3>
        <ul className="events">
          {events && events.length > 0 ? (
            <>
              {events.slice(0, 3).map((event: IEvent) => (
                <li key={event.title} className="list-none">
                  <EventCard {...event} />
                </li>
              ))}
            </>
          ) : (
            <p>No events found</p>
          )}
        </ul>
        {events.length > 3 && (
          <div className="flex justify-center my-12">
            <div>
              <Link id="explore-btn" href="/events">
                View more
              </Link>
            </div>
          </div>
        )}
      </div>
      </section>
    </>
  );
}
