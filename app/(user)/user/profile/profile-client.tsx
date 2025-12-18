"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { EventType } from "../../../lib/constants";
import EventCard from "../../../../components/EventCard";

type Props = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    [key: string]: any;
  };
  bookedEvents: EventType[];
};

export default function ProfileClient({ user, bookedEvents }: Props) {
  const displayName = useMemo(() => {
    return user?.name || user?.email || "User";
  }, [user]);

  const initials = useMemo(() => {
    const base = (user?.name || user?.email || "U").toString();
    const parts = base.split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return base.slice(0, 2).toUpperCase();
  }, [user]);

  const hasBookings = bookedEvents.length > 0;

  return (
    <section className="flex flex-col gap-10">
      <div className="glass card-shadow w-full" style={{ padding: 18 }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-black font-semibold">
                {initials}
              </div>
            )}

            <div className="flex flex-col">
              <h3 className="leading-tight">{displayName}</h3>
              {user?.email && (
                <p className="text-light-200 text-sm" style={{ marginTop: 2 }}>
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-xs text-light-200">
              {hasBookings
                ? `${bookedEvents.length} booked event${
                    bookedEvents.length === 1 ? "" : "s"
                  }`
                : "No booked events yet"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-light-100 text-lg max-sm:text-sm">
            Events you’ve booked.
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        {hasBookings ? (
          <div className="events">
            {bookedEvents.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>
        ) : (
          <div
            className="bg-dark-100 border border-dark-200 rounded-[10px]"
            style={{ padding: 18 }}
          >
            <p className="text-light-200 text-sm">
              You haven’t booked any events yet.
            </p>
          </div>
        )}
      </section>
    </section>
  );
}
