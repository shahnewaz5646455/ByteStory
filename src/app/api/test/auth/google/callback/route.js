import { connectDB } from "@/lib/database.Connection";
import UserModel from "@/app/models/User.model";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Get the code from Google redirect
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Authorization code not provided" },
        { status: 400 }
      );
    }

    // 3️⃣ Exchange code for tokens
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

    // 4️⃣ Fetch user info from Google
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

    // 5️⃣ Find or create the user
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({
        name,
        email,
        photo,
        role: "user", // default role
        isEmailVerified: true,
      });
      await user.save();
    }

    // 6️⃣ Generate JWT
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

    // 7️⃣ Role-based redirect
    let redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/`;
    if (user.role === "admin") {
      redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/adminDashboard`;
    } else if (user.role === "user") {
      redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/website/my-account`;
    }

    // 8️⃣ Set cookie and redirect
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("authToken", jwt, { httpOnly: true, path: "/" });

    return response;
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Google login failed" },
      { status: 500 }
    );
  }
}
