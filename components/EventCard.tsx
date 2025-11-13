import Image from "next/image"
import Link from "next/link"
import React from "react"
import { EventType } from "../app/lib/constants"

const EventCard = ({title, slug, image, location, date, time}: EventType) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image src={image} alt={title} width={410} height={300} className="poster"/>
      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14}/>
        <p className="location">{location}</p>
      </div>

      <p className="title">{title}</p>

      <div className="datetime">
        <Image src="/icons/calendar.svg" alt="date" width={14} height={14}/>
        <p className="date">{date}</p>
        <Image src="/icons/clock.svg" alt="time" width={14} height={14}/>
        <p className="time">{time}</p>
      </div>

    </Link>
  )
}

export default EventCard
