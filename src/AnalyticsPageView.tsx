import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePostHog } from "posthog-js/react";

export default function AnalyticsPageview() {
  const posthog = usePostHog();
  const { pathname, search } = useLocation();

  useEffect(() => {
    posthog?.capture("$pageview");
  }, [pathname, search, posthog]);

  return null;
}
