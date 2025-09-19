import UserModel from "@/app/models/User.model";
import { connectDB } from "@/lib/database.Connection";
import { response, catchError } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const validationSchema = zSchema.pick({
      email: true,
      password: true,
    });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        400,
        "Invalid or missing input field",
        validatedData.error
      );
    }

    const { email, password } = validatedData.data;
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );

    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // hash the new password (recommended!)
    // const hashedPassword = await bcrypt.hash(password, 10);

    getUser.password = password;
    await getUser.save();

    return response(true, 200, "Password updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
