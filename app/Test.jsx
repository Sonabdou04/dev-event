"use client";
import posthog from 'posthog-js';

export default function TestEventButton() {
  return (
    <button
      onClick={() => posthog.capture('my event', { property: 'value' })}
      className="bg-blue-600 text-white px-4 py-2 rounded mt-20"
    >
      Send Test Event
    </button>
  );
}
