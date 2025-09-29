import OTPModel from "@/app/models/Otp.model";
import UserModel from "@/app/models/User.model";
import { connectDB } from "@/lib/database.Connection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    connectDB();

    const payload = await request.json();

    // Validate input
    const validationSchema = zSchema.pick({ otp: true, email: true });
    const validationData = validationSchema.safeParse(payload);

    if (!validationData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validationData.error
      );
    }

    const { email, otp } = validationData.data;

    // Find OTP
    const getOtpData = await OTPModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 404, "Invalid or expired OTP");
    }

    // Find User
    const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();
    if (!getUser) {
      return response(false, 401, "User not found");
    }

    // Prepare user data
    const loggedInUserData = {
      _id: getUser._id,
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    };

    // Generate JWT token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    // Set cookie (optional)
    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Delete OTP after validation
    await getOtpData.deleteOne();

    // ✅ Return user data with token
    return response(true, 200, "Login Successful", {
      ...loggedInUserData,
      token,
    });
  } catch (error) {
    console.error("Verify API Error:", error);
    return catchError(error);
  }
}
