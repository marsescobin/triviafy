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

// Debug logging BEFORE initialization
console.log("PostHog Debug Info:", {
  key: POSTHOG_KEY ? "✅ Present" : "❌ Missing",
  keyValue: POSTHOG_KEY ? `${POSTHOG_KEY.substring(0, 10)}...` : "undefined",
  host: POSTHOG_HOST,
  mode: import.meta.env.MODE,
});

if (!POSTHOG_KEY) {
  console.warn(
    "⚠️ Missing PostHog key. Did you set VITE_PUBLIC_POSTHOG_KEY in Cloudflare Pages?"
  );
} else {
  try {
    // Initialize PostHog with error handling
    console.log("Attempting to initialize PostHog...");

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      debug: import.meta.env.MODE === "development",
      loaded: (posthog) => {
        console.log("✅ PostHog loaded successfully!", posthog);
        // Capture test event after successful initialization
        posthog.capture("app_initialized", {
          environment: import.meta.env.MODE,
          timestamp: new Date().toISOString(),
        });
      },
    });

    // Check initialization status after a short delay
    setTimeout(() => {
      console.log("PostHog status after init:", {
        isInitialized: posthog.__loaded,
        isFeatureFlagsLoaded: posthog.isFeatureFlagsLoaded(),
        hasFeatureFlags: posthog.getFeatureFlags(),
      });
    }, 1000);
  } catch (error) {
    console.error("❌ PostHog initialization failed:", error);
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>
);
