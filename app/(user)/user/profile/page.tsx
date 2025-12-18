import ProfileClient from "./profile-client";
import { getUserBookedEvents } from "../../../lib/actions/booking.actions";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const bookedEvents = await getUserBookedEvents();

  return (
    <ProfileClient user={session.user} bookedEvents={bookedEvents} />
  );
}
