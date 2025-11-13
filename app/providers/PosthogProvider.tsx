"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function PosthogProvider() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
        capture_pageview: true,
        capture_pageleave: true,
      });

      // Debugging: check if init actually worked
      console.log("PostHog initialized:", posthog.isFeatureEnabled ? "✅" : "❌");
    }
  }, []);

  return null;
}
