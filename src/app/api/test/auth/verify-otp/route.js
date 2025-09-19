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
    const validationSchema = zSchema.pick({
      otp: true,
      email: true,
    });

    const validationData = validationSchema.safeParse(payload);

    if (!validationData.success) {
      return response(
        false,
        401,
        "invalid or missing input field",
        validationData.error
      );
    }

    const { email, otp } = validationData.data;
    const getOtpData = await OTPModel.findOne({ email, otp });

    if (!getOtpData) {
      return response(false, 404, "invalid or expired otp");
    }

    const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();

    if (!getOtpData) {
      return response(false, 401, "user not found");
    }

    const loggedInUserData = {
      _id: getUser._id,
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const cookieStore = await cookies();

    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    //   delete otp after validation
    await getOtpData.deleteOne();
    return response(true, 200, "login SuccessFull", loggedInUserData);
  } catch (error) {
    console.error("Verify API Error:", error);
    return catchError(error);
  }
}
