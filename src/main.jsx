import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

// Grab env vars (must start with VITE_ to be exposed)
const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

if (!POSTHOG_KEY) {
  console.warn(
    "⚠️ Missing PostHog key. Did you set VITE_PUBLIC_POSTHOG_KEY in Cloudflare Pages?"
  );
} else {
  // Initialize PostHog
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    debug: false,
    loaded: (posthog) => {
      // Capture app initialization event
      posthog.capture("app_initialized", {
        environment: import.meta.env.MODE,
        timestamp: new Date().toISOString(),
      });
    },
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>
);
