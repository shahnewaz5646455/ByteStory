import UserModel from "@/app/models/User.model";
import { connectDB } from "@/lib/database.Connection";
import { response } from "@/lib/helperFunction";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    connectDB();
    const { token } = await request.json();

    if (!token) {
      return response(false, 400, "Missing token");
    }
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload.userId;

    console.log(decoded, "suer id ");

    // if (!isEmailVerified(userId)) {
    //   return response(false, 400, "inviled id", userId);
    // }

    //   get the user
    const user = await UserModel.findById(userId);
    if (!user) {
      return response(false, 404, "User Not Fount");
    }

    user.isEmailVerified = true;
    await user.save();
    return response(true, 200, "Email Verification success");
  } catch (error) {
    console.error("Verify API Error:", error);
    return response(false, 500, "Internal server error");
  }
}
