import UserModel from "@/app/models/User.model";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/database.Connection";
import { response } from "@/lib/helperFunction";
import { sendMailer } from "@/lib/sendMail";
// import { sendMailer } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();

    // validation schema
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validationData = validationSchema.safeParse(payload);

    if (!validationData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validationData.error
      );
    }

    const { name, email, password } = validationData.data;

    // check if user already exists
    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User already registered");
    }

    // new registration
    const newRegistration = new UserModel({ name, email, password });
    await newRegistration.save();

    // create jwt token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newRegistration._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    // send email
    const mailResult = await sendMailer(
      "Email Verification from ByteStory",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`
      )
    );
    // console.log("📧 Mail result:", mailResult);

    if (!mailResult.success) {
      return response(false, 500, "Failed to send verification email");
    }

    return response(
      true,
      200,
      "Registration success. Please verify your Email"
    );
  } catch (error) {
    console.error(" Registration error:", error);
    return response(false, 500, "Internal Server Error", error.message);
  }
}
