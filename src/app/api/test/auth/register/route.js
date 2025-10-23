import UserModel from "@/app/models/User.model";
import NotificationModel from "@/app/models/Notification.model";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/database.Connection";
import { response } from "@/lib/helperFunction";
import { sendMailer } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    console.log("🚀 === REGISTRATION PROCESS STARTED ===");

    await connectDB();
    console.log("✅ Database connected");

    const payload = await request.json();
    console.log("📥 Registration payload:", payload);

    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const validationData = validationSchema.safeParse(payload);

    if (!validationData.success) {
      console.log("❌ Validation failed:", validationData.error);
      return response(
        false,
        401,
        "Invalid or missing input field",
        validationData.error
      );
    }

    const { name, email, password } = validationData.data;
    console.log("👤 Processing user:", { name, email });

    // check if user already exists
    const checkUser = await UserModel.exists({ email });

    if (checkUser) {
      console.log("❌ User already registered");
      return response(false, 409, "User already registered");
    }

    // new registration
    console.log("💾 Creating new user...");
    const newRegistration = new UserModel({
      name,
      email,
      password,
      // ===== ADD QUOTA FIELDS HERE =====
      seo_key: 5,
      hashtag_key: 2,
      email_key: 2,
      pdf_key: 2,
      grammar_key: 5,
      // ===== END QUOTA FIELDS =====
    });
    await newRegistration.save();
    console.log(
      "✅ User saved to database. ID:",
      newRegistration._id.toString()
    );

    // ================= NOTIFICATION CREATION =================
    console.log("🔄 === ATTEMPTING NOTIFICATION CREATION ===");

    try {
      console.log("📋 Step 1: Testing NotificationModel import...");

      // Test if NotificationModel is working
      const testCount = await NotificationModel.countDocuments();
      console.log(
        "✅ NotificationModel is accessible. Current count:",
        testCount
      );

      const notificationData = {
        type: "user_registered",
        title: "New User Registration",
        message: `New user ${name} has registered with email ${email}`,
        data: {
          userId: newRegistration._id.toString(),
          userName: name,
          userEmail: email,
          userRole: newRegistration.role || "user",
          registrationDate: new Date().toISOString(),
          provider: "email",
        },
        priority: "high",
      };

      const notification = await NotificationModel.create(notificationData);

      // Verify it was saved
      const verifyNotification = await NotificationModel.findById(
        notification._id
      );
      console.log(
        "✅ Notification verified in database:",
        !!verifyNotification
      );
    } catch (notificationError) {
      console.error("❌ Error message:", notificationError.message);
    }

    // ================= END NOTIFICATION CREATION =================

    // create jwt token
    console.log("🔐 Creating JWT token...");
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

    if (!mailResult.success) {
      return response(false, 500, "Failed to send verification email");
    }

    console.log("🎊 === REGISTRATION COMPLETED SUCCESSFULLY ===");
    return response(
      true,
      200,
      "Registration success. Please verify your Email"
    );
  } catch (error) {
    console.error("❌ Error message:", error.message);

    return response(false, 500, "Internal Server Error", error.message);
  }
}
