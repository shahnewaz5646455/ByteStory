// This file contains helper functions for visitor tracking

export class VisitorUtils {
  // Get information about the visitor's device and browser
  static getClientInfo() {
    // For now, we'll use simple detection
    // In a real app, you might want to use a library like 'ua-parser-js'

    const userAgent =
      typeof window !== "undefined" ? navigator.userAgent : "Server";

    // Simple device detection
    let deviceType = "desktop";
    if (
      /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      )
    ) {
      deviceType = "mobile";
    } else if (/Tablet|iPad|PlayBook|Silk|Kindle/i.test(userAgent)) {
      deviceType = "tablet";
    }

    // Simple browser detection
    let browser = "Unknown";
    if (/Chrome/i.test(userAgent)) browser = "Chrome";
    else if (/Firefox/i.test(userAgent)) browser = "Firefox";
    else if (/Safari/i.test(userAgent)) browser = "Safari";
    else if (/Edge/i.test(userAgent)) browser = "Edge";

    // Simple OS detection
    let os = "Unknown";
    if (/Windows/i.test(userAgent)) os = "Windows";
    else if (/Mac/i.test(userAgent)) os = "Mac";
    else if (/Linux/i.test(userAgent)) os = "Linux";
    else if (/Android/i.test(userAgent)) os = "Android";
    else if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) os = "iOS";

    return {
      ipAddress: "unknown", // We'll get this from the server
      userAgent: userAgent.substring(0, 500), // Limit length
      deviceType,
      browser,
      os,
    };
  }

  // Generate a unique session ID
  static generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
