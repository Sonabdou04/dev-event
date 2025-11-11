import Image from "next/image"
import Link from "next/link"

const EventCard = ({title, image}) => {
  return (
    <Link href="/" id="event-card">
      <Image src={image} alt={title} width={410} height={300} className="poster"/>
      <p className="title">{title}</p>
    </Link>
  )
}

export default EventCard
