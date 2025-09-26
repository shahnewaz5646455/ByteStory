"use client";

import { useVisitorTracking } from "@/hooks/useVisitorTracking";

// This component doesn't show anything visible
// It just runs the tracking hook in the background
export function VisitorTracking() {
  useVisitorTracking();

  return null; // No visible output
}
