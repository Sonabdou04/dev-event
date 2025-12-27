"use client"

import Image from "next/image"

const ExploreBtn = () => {
  return (
      <button
        type="button"
        id="explore-btn"
        className="mx-auto mt-7"
        onClick={() => {
          const section = document.getElementById("events")
          if (section) {
            section.scrollIntoView({ behavior: "smooth" })
          }
        }}
      >
        <span className="inline-flex items-center gap-2">
          <span>Explore Events</span>
          <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
        </span>
      </button>
  )
}

export default ExploreBtn
