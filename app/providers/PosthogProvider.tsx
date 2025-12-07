"use client";

import React, { useEffect } from "react";
import posthog from "posthog-js";

type PosthogProviderProps = {
  children: React.ReactNode;
};

export function PosthogProvider({ children }: PosthogProviderProps) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

    // Only initialize if we have a key
    if (!apiKey) {
      return;
    }

    if (!posthog.__loaded) {
      posthog.init(apiKey, {
        api_host: apiHost,
      });
    }
  }, []);

  return <>{children}</>;
}

