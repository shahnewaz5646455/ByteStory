import UserModel from "@/app/models/User.model";
import { connectDB } from "@/lib/database.Connection";
import { response } from "@/lib/helperFunction";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    await connectDB(); // await add করুন
    const { token } = await request.json();

    if (!token) {
      return response(false, 400, "Missing token");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload.userId;

    console.log("User ID from token:", userId);

    // Get the user
    const user = await UserModel.findById(userId);
    if (!user) {
      return response(false, 404, "User Not Found");
    }

    user.isEmailVerified = true;
    await user.save();

    // IMPORTANT: Return user data for auto-login
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      token: "user-token-" + user._id, // Temporary token
    };

    return response(
      true,
      200,
      "Email Verification successful! You are now logged in.",
      userData
    );
  } catch (error) {
    console.error("Verify API Error:", error);

    if (error.code === "ERR_JWT_EXPIRED") {
      return response(false, 400, "Verification link has expired");
    }

    return response(false, 500, "Internal server error");
  }
}
