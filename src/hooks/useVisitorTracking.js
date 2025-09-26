import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// This hook will track page visits automatically
export const useVisitorTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Function to track the visit
    const trackVisit = async () => {
      try {
        // Get or create session ID from localStorage
        let currentSessionId =
          sessionId || localStorage.getItem("visitorSessionId");

        if (!currentSessionId) {
          currentSessionId =
            Math.random().toString(36).substring(2) + Date.now().toString(36);
          localStorage.setItem("visitorSessionId", currentSessionId);
          setSessionId(currentSessionId);
        }

        // Get current page URL
        const fullPath =
          pathname +
          (searchParams.toString() ? `?${searchParams.toString()}` : "");

        // Where did they come from?
        const referrer = document.referrer || "direct";

        // Send tracking data to our API
        const response = await fetch("/api/visitors/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: fullPath,
            referrer: referrer,
            sessionId: currentSessionId,
          }),
        });

        if (response.ok) {
          console.log("Page visit tracked successfully");
        }
      } catch (error) {
        console.error("Error tracking visit:", error);
      }
    };

    // Track visit when page changes
    if (pathname) {
      trackVisit();
    }

    // Set up heartbeat to keep session active (every 2 minutes)
    const heartbeatInterval = setInterval(async () => {
      if (sessionId && pathname) {
        try {
          const fullPath =
            pathname +
            (searchParams.toString() ? `?${searchParams.toString()}` : "");

          await fetch("/api/visitors/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page: fullPath,
              sessionId: sessionId,
            }),
          });
        } catch (error) {
          console.error("Heartbeat error:", error);
        }
      }
    }, 120000); // 2 minutes

    // Clean up interval when component unmounts
    return () => clearInterval(heartbeatInterval);
  }, [pathname, searchParams, sessionId]); // Removed session dependency

  return { sessionId };
};
