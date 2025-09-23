import UserModel from "@/app/models/User.model";
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

    // Check if user exists
    let user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      user = new UserModel({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        photo: payload.picture || "",
        role: "user", // default role
        isEmailVerified: true,
      });
      await user.save();
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
        message: "Google login successful",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photo: user.photo,
          token,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Google Auth Error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 400 }
    );
  }
}
