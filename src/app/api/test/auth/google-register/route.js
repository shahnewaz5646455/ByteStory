import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/database.Connection";
import { OAuth2Client } from "google-auth-library";
import UserModel from "@/app/models/User.model";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    await connectDB();

    const { credential } = await req.json();
    if (!credential) {
      return NextResponse.json(
        { success: false, message: "Missing credential" },
        { status: 400 }
      );
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split("@")[0];
    const photo = payload.picture || "";
    const isEmailVerified = payload.email_verified || true;

    // Check if user exists
    let user = await UserModel.findOne({ email });
    if (!user) {
      // Create new user
      user = await UserModel.create({
        name,
        email,
        role: "user",
        photo,
        isEmailVerified,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Set HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: "Google registration/login successful",
      data: { ...user.toObject() },
    });
    response.cookies.set("authToken", token, { httpOnly: true, path: "/" });

    return response;
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Google registration error" },
      { status: 400 }
    );
  }
}
