import OTPModel from "@/app/models/Otp.model";
import UserModel from "@/app/models/User.model";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/database.Connection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMailer } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import { email } from "zod";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();
    const validationSchema = zSchema.pick({ email: true });
    const validationData = validationSchema.safeParse(payload);

    if (!validationData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validationData.error
      );
    }

    const { email } = validationData.data;

    const getUser = await UserModel.findOne({ email });

    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // remove old otp
    await OTPModel.deleteMany({ email });
    const otp = generateOTP();
    const newOtpData = new OTPModel({
      email,
      otp,
    });
    await newOtpData.save();

    const otpSendStatus = await sendMailer(
      "your login verification code",
      email,
      otpEmail(otp)
    );

    if (!otpSendStatus.success) {
      return response(false, 400, "Failed t resend otp");
    }

    return response(true, 200, "Otp send successfully");
  } catch (error) {
    return catchError(error);
  }
}
