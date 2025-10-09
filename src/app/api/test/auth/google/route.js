// app/api/test/auth/google/route.js
import UserModel from "@/app/models/User.model";
import Notification from "@/app/models/Notification.model";
import { connectDB } from "@/lib/database.Connection";
import { OAuth2Client } from "google-auth-library";
import { SignJWT } from "jose";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    const { credential } = await req.json();

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Connect to DB
    await connectDB();

    let isNewUser = false;

    // Check if user exists
    let user = await UserModel.findOne({ email: payload.email });

    if (!user) {
      // Create new user
      user = new UserModel({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        photo: payload.picture || "",
        role: "user", // default role
        isEmailVerified: true,
        provider: "google",
        googleId: payload.sub,
      });
      await user.save();
      isNewUser = true;

      // ✅ Create notification for new user registration
      await createNewUserNotification(user);
    }

    // Generate JWT
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({
      id: user._id,
      email: user.email,
      role: user.role,
    })
      .setIssuedAt()
      .setExpirationTime("7d")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    return new Response(
      JSON.stringify({
        success: true,
        message: isNewUser
          ? "User registered successfully!"
          : "Login successful!",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photo: user.photo,
          token,
        },
        isNewUser: isNewUser,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Google Auth Error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Google authentication failed",
        error: err.message,
      }),
      { status: 400 }
    );
  }
}

// Function to create new user notification
async function createNewUserNotification(user) {
  try {
    const notification = new Notification({
      type: "user_registered",
      title: "New User Registration",
      message: `${user.name} has registered via Google Login`,
      data: {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        provider: "google",
        registrationSource: "google_oauth",
        timestamp: new Date().toISOString(),
      },
      priority: "medium",
    });

    await notification.save();

    console.log(`✅ Notification created for new user: ${user.name}`);

    // Emit real-time event if Socket.io is available
    if (global.io) {
      global.io.emit("new_notification", {
        type: "user_registered",
        data: notification,
      });
      console.log(`📢 Real-time notification emitted for: ${user.name}`);
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't throw error, just log it so login process continues
  }
}
