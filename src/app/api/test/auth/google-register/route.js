import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/database.Connection";
import { OAuth2Client } from "google-auth-library";
import UserModel from "@/app/models/User.model";
import NotificationModel from "@/app/models/Notification.model";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    console.log("🚀 === GOOGLE REGISTRATION PROCESS STARTED (TEST ROUTE) ===");

    await connectDB();
    console.log("✅ Database connected");

    const { credential } = await req.json();
    if (!credential) {
      console.log("❌ Missing Google credential");
      return NextResponse.json(
        { success: false, message: "Missing credential" },
        { status: 400 }
      );
    }

    console.log("🔐 Verifying Google token...");
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split("@")[0];
    const photo = payload.picture || "";
    const isEmailVerified = payload.email_verified || true;

    console.log("👤 Google user data:", { name, email, isEmailVerified });

    let user = await UserModel.findOne({ email });
    let isNewUser = false;

    console.log(
      "🔍 Checking if user exists in database:",
      user ? "EXISTS" : "NEW USER"
    );

    if (!user) {
      console.log("💾 Creating new Google user...");
      user = await UserModel.create({
        name,
        email,
        role: "user",
        photo,
        isEmailVerified,
        provider: "google",
        // ===== ADD QUOTA FIELDS HERE =====
        seo_key: 5,
        hashtag_key: 2,
        email_key: 2,
        pdf_key: 2,
        grammar_key: 5,
        // ===== END QUOTA FIELDS =====
      });

      console.log("✅ Google user created. ID:", user._id.toString());
      isNewUser = true;

      // ================= NOTIFICATION CREATION =================
      console.log("🔄 === ATTEMPTING GOOGLE NOTIFICATION CREATION ===");

      try {
        console.log("📋 Testing NotificationModel for Google user...");

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

        console.log("📦 Google notification data prepared");

        const notification = await NotificationModel.create(notificationData);

        console.log("🎉 GOOGLE NOTIFICATION CREATED SUCCESSFULLY!");
        console.log("📬 Notification ID:", notification._id);

        // Verify it was saved
        const verifyNotification = await NotificationModel.findById(
          notification._id
        );
        console.log("✅ Google notification verified:", !!verifyNotification);
      } catch (notificationError) {
        console.error("💥 GOOGLE NOTIFICATION CREATION FAILED!");
        console.error("❌ Error:", notificationError.message);
      }

      console.log("🔄 === GOOGLE NOTIFICATION PROCESS COMPLETED ===");
    } else {
      console.log("ℹ️ Existing user, no notification needed");
    }

    console.log("🔐 Creating JWT token...");
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: isNewUser
        ? "Google registration successful"
        : "Google login successful",
      data: { ...user.toObject() },
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    console.log("🎊 === GOOGLE REGISTRATION COMPLETED ===");
    console.log("👤 User:", isNewUser ? "NEW" : "EXISTING", "-", name);

    return response;
  } catch (error) {
    console.error("💥 GOOGLE REGISTRATION FAILED:", error.message);
    return NextResponse.json(
      { success: false, message: "Google registration error" },
      { status: 400 }
    );
  }
}
