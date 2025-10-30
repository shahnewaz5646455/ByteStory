import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/database.Connection";
import ActiveSession from "@/app/models/ActiveSession";
import Visitor from "@/app/models/Visitor";
import PageView from "@/app/models/PageView";
import UserModel from "@/app/models/User.model";
import { authOptions } from "../../auth/[...nextauth]/route";
export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Get the current user session (if logged in) - this works on server side
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (error) {
      console.log("No session found or session error:", error);
      // Continue without session - user is probably not logged in
    }

    // Get data from the request
    const { page, referrer, sessionId } = await request.json();

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page is required" },
        { status: 400 }
      );
    }

    // Get client information from request headers
    const clientInfo = {
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      deviceType: "desktop", // We'll detect this properly later
      browser: "Unknown",
      os: "Unknown",
    };

    // Simple device detection from user agent
    const userAgent = clientInfo.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
      clientInfo.deviceType = "mobile";
    } else if (/tablet|ipad|playbook|silk|kindle/i.test(userAgent)) {
      clientInfo.deviceType = "tablet";
    }

    // Simple browser detection
    if (/chrome/i.test(userAgent)) clientInfo.browser = "Chrome";
    else if (/firefox/i.test(userAgent)) clientInfo.browser = "Firefox";
    else if (/safari/i.test(userAgent)) clientInfo.browser = "Safari";
    else if (/edge/i.test(userAgent)) clientInfo.browser = "Edge";

    // Simple OS detection
    if (/windows/i.test(userAgent)) clientInfo.os = "Windows";
    else if (/macintosh|mac os/i.test(userAgent)) clientInfo.os = "Mac";
    else if (/linux/i.test(userAgent)) clientInfo.os = "Linux";
    else if (/android/i.test(userAgent)) clientInfo.os = "Android";
    else if (/iphone|ipad|ipod/i.test(userAgent)) clientInfo.os = "iOS";

    // Generate session ID if not provided
    const currentSessionId =
      sessionId ||
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Check if user is logged in
    const isUser = !!session?.user?.id;
    const visitorType = isUser ? "user" : "guest";

    let userInfo = null;
    if (isUser && session.user.id) {
      try {
        // Get user details from database
        const user = await UserModel.findById(session.user.id).select(
          "name email role"
        );
        if (user) {
          userInfo = {
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      } catch (userError) {
        console.error("Error fetching user info:", userError);
        // Continue without user info
      }
    }

    // Check if this is a new visitor session
    let visitor = await Visitor.findOne({ sessionId: currentSessionId });

    if (!visitor) {
      // Create new visitor record
      visitor = await Visitor.create({
        userId: session?.user?.id || null,
        sessionId: currentSessionId,
        ...clientInfo,
        landingPage: page,
        referrer: referrer || "direct",
        visitorType,
      });
    }

    // Record this page view
    await PageView.create({
      visitorId: visitor._id,
      page: page,
      referrer: referrer || "direct",
    });

    // Update active sessions (who's online right now)
    await ActiveSession.findOneAndUpdate(
      { sessionId: currentSessionId },
      {
        userId: session?.user?.id || null,
        ...clientInfo,
        lastActive: new Date(),
        page: page,
        userType: visitorType,
        userInfo: userInfo,
      },
      { upsert: true, new: true }
    );

    // Return success response
    return NextResponse.json({
      success: true,
      sessionId: currentSessionId,
      visitorType: visitorType,
      message: "Visitor tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track visitor" },
      { status: 500 }
    );
  }
}
