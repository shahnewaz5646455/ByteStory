import UserModel from "@/app/models/User.model";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/database.Connection";
import { response } from "@/lib/helperFunction";
import { sendMailer } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const validationSchema = zSchema
      .pick({ email: true })
      .extend({ password: z.string() });

    const validationData = validationSchema.safeParse(payload);
    if (!validationData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validationData.error
      );
    }

    const { email, password } = validationData.data;

    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );
    if (!getUser) return response(false, 400, "Invalid login credentials");

    // resend email verified
    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      await sendMailer(
        "Email Verification from ByteStory",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`
        )
      );

      return response(
        false,
        401,
        "Your email is not verified. A verification link has been sent to your registration email."
      );
    }

    // password verification
    const isPasswordVerified = await getUser.comparePassword(password);
    if (!isPasswordVerified)
      return response(false, 400, "Invalid login credentials");

    // Remove OTP system completely and directly return user data
    const userData = {
      _id: getUser._id,
      name: getUser.name,
      email: getUser.email,
      role: getUser.role,
      isEmailVerified: getUser.isEmailVerified,
      createdAt: getUser.createdAt,
      token: "auth-token-" + getUser._id,
    };

    return response(true, 200, "Login successful", userData);
  } catch (error) {
    console.error("Login error:", error);
    return response(false, 500, "Internal server error", error.message);
  }
}
