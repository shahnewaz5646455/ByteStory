import { connectDB } from "@/lib/database.Connection";
import UserModel from "@/app/models/User.model";
import NotificationModel from "@/app/models/Notification.model"; // Add this import
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    // 2 Get the code from Google redirect
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Authorization code not provided" },
        { status: 400 }
      );
    }

    console.log("🔐 Exchanging code for tokens...");

    //  Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/test/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      return NextResponse.json(
        { success: false, message: "Failed to get access token from Google" },
        { status: 400 }
      );
    }

    //  Fetch user info from Google

    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );
    const googleUser = await userRes.json();

    const name = googleUser?.name || googleUser?.given_name || "Unknown User";
    const email = googleUser?.email;
    const photo = googleUser?.picture || "";

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Google did not return an email address" },
        { status: 400 }
      );
    }

    console.log("👤 Google user data:", { name, email });

    //  Find or create the user
    let user = await UserModel.findOne({ email });
    let isNewUser = false;

    if (!user) {
      console.log("💾 Creating new Google user...");
      user = new UserModel({
        name,
        email,
        photo,
        role: "user",
        isEmailVerified: true,
        provider: "google", // Add provider field
      });
      await user.save();
      isNewUser = true;

      // ================= NOTIFICATION CREATION =================

      try {
        const notificationData = {
          type: "user_registered",
          title: "New Google User Registration",
          message: `New user ${name} registered via Google`,
          data: {
            userId: user._id.toString(),
            userName: name,
            userEmail: email,
            userRole: "user",
            provider: "google",
            registrationDate: new Date().toISOString(),
          },
          priority: "high",
        };

        const notification = await NotificationModel.create(notificationData);

        // Verify it was saved
        const verifyNotification = await NotificationModel.findById(
          notification._id
        );
        console.log(
          "✅ Google notification verified in database:",
          !!verifyNotification
        );
      } catch (notificationError) {
        console.error("❌ Error message:", notificationError.message);
      }
    } else {
      console.log("ℹ️ Existing user, no notification needed");
    }

    // Generate JWT

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const jwt = await new SignJWT({
      id: user._id,
      email: user.email,
      role: user.role,
    })
      .setIssuedAt()
      .setExpirationTime("7d")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    // Role-based redirect
    let redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/`;
    if (user.role === "admin") {
      redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/adminDashboard`;
    } else if (user.role === "user") {
      redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/website/my-account`;
    }

    console.log("📍 Redirecting to:", redirectUrl);
    console.log(
      "👤 User type:",
      isNewUser ? "NEW GOOGLE USER" : "EXISTING USER"
    );

    // Set cookie and redirect
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("authToken", jwt, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("❌ Error message:", error.message);

    return NextResponse.json(
      { success: false, message: "Google login failed" },
      { status: 500 }
    );
  }
}
