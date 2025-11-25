import Image from "next/image";
import { notFound } from "next/navigation";
import BookEvent from "../../../components/BookEvent";
import { getSimilarEvents } from "../../lib/actions/event.actions";
import { IEvent } from "../../lib/database";
import EventCard from "../../../components/EventCard";
import { cacheLife } from "next/cache";

const EventDetail = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className="agenda">
      <h2>Event Agenda</h2>
      <ul>
        {agendaItems.map((agendaItem, index) => (
          <li key={index}>{agendaItem}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div className="pill" key={tag}>
          {tag}
        </div>
      ))}
    </div>
  );
};

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  "use cache";
  cacheLife("hours")
  const { slug } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`
  );
  const {
    event: {
      description,
      overview,
      image,
      location,
      mode,
      title,
      venue,
      date,
      time,
      audience,
      agenda,
      organizer,
      tags,
    },
  } = await response.json();
  if (!description) return notFound();

  const booking = 5;
  const similarEvents = await getSimilarEvents(slug);
  return (
    <section id="event">
      <div className="header">
        <h1>Event Details</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt={title}
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>{title}</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <p>{overview}</p>
            <EventDetail
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetail icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetail
              icon="/icons/pin.svg"
              alt="location"
              label={location}
            />
            <EventDetail icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetail
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>
          {agenda && agenda.length > 0 && <EventAgenda agendaItems={agenda} />}          <div className="flex-col-gap-2">
            <h2>The Event Organizer</h2>
            <p>{organizer}</p>
          </div>
          {tags && tags.length > 0 && <EventTags tags={tags} />}        </div>
        <aside className="booking">
          <div className="signup-card">
            <h2>Book this event</h2>
            {booking > 0 ? (
              <p className="text-sm">Join {booking} people who are also interested in this event!</p>
            ) : (
              <p className="text-sm">Be the first to join this event!</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>
      <div className="w-full flex flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 ? similarEvents.map((event: IEvent) => (
            <EventCard key={event.title} {...event} />
          )) : (
            <p>No similar events found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default page;
