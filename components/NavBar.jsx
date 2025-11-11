import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link className='logo' href="/">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
        <p>EventHub</p>
        </Link>
        <ul>
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/create-event">Create Event</Link>
        </ul>
      </nav>
    </header>
  )
}

export default NavBar
