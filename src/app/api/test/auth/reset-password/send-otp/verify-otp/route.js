import OTPModel from "@/app/models/Otp.model";
import UserModel from "@/app/models/User.model";
import { connectDB } from "@/lib/database.Connection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {
  try {
    await connectDB(); // await needed

    const payload = await request.json();
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

    const getOtpData = await OTPModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 404, "Invalid or expired OTP");
    }

    const getUser = await UserModel.findOne({ email, deletedAt: null });
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // Delete OTP after validation
    await getOtpData.deleteOne();

    // Return success with user data
    return response(true, 200, "OTP verified successfully", {
      email: getUser.email,
      id: getUser._id,
    });
  } catch (error) {
    console.error("Verify API Error:", error);
    return catchError(error);
  }
}
