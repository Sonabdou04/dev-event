import Image from "next/image";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { auth } from "../app/lib/auth";

type Session = typeof auth.$Infer.Session;
export default async function NavBar({ session }: { session: Session | null }) {
  
  return (
    <header>
      <nav>
        <Link className="logo" href="/">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>EventHub</p>
        </Link>
        <ul>
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          {session && (
            <>
              <Link href="/create-event">Create Event</Link>{" "}
              <Link href={"/dashboard"}>Dashboard</Link>
              <ProfileDropdown user={session.user} />
            </>
          )}
          {!session && <Link href="/login">Login</Link>}
        </ul>
      </nav>
    </header>
  );
}
