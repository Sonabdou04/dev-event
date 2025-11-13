// constants.ts

export type EventType = {
  title: string;
  slug: string;
  image: string;
  location: string;
  date: string;
  time: string;
};

export const EVENTS: EventType[] = [
  {
    title: "Tech Innovators Conference 2025",
    slug: "tech-innovators-conference-2025",
    image: "/images/event1.png",
    location: "Berlin, Germany",
    date: "2025-03-18",
    time: "09:00 AM - 05:00 PM",
  },
  {
    title: "AI & Machine Learning Summit",
    slug: "ai-ml-summit-2025",
    image: "/images/event2.png",
    location: "Munich, Germany",
    date: "2025-04-10",
    time: "10:00 AM - 06:30 PM",
  },
  {
    title: "Next.js Global Developers Meetup",
    slug: "nextjs-developers-meetup",
    image: "/images/event3.png",
    location: "Hamburg, Germany",
    date: "2025-05-22",
    time: "01:00 PM - 07:00 PM",
  },
  {
    title: "Design & UX Experience Workshop",
    slug: "design-ux-experience-workshop",
    image: "/images/event4.png",
    location: "Cologne, Germany",
    date: "2025-06-05",
    time: "09:30 AM - 04:00 PM",
  },
  {
    title: "Startup Networking Night",
    slug: "startup-networking-night",
    image: "/images/event5.png",
    location: "Frankfurt, Germany",
    date: "2025-06-28",
    time: "07:00 PM - 11:00 PM",
  },
  {
    title: "Cloud Computing Expo Europe",
    slug: "cloud-computing-expo",
    image: "/images/event6.png",
    location: "Amsterdam, Netherlands",
    date: "2025-07-15",
    time: "09:00 AM - 05:00 PM",
  },
];
