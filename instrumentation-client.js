// instrumentation-client.js
import PostHog from 'posthog-js'

PostHog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-05-24'
});
