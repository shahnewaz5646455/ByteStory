import UserModel from "@/app/models/User.model";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/lib/cloudinaryUpload";
import { connectDB } from "@/lib/database.Connection";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Helper to get user ID from headers
const getUserId = (req) => {
  const userId = req.headers.get("x-user-id");
  console.log("🔍 User ID from header:", userId);
  return userId;
};

// Check if string is a valid MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

// GET — Fetch logged-in user's own profile
export async function GET(req) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    let user;

    // Check if userId is a valid ObjectId
    if (isValidObjectId(userId)) {
      console.log("🔍 Searching by ObjectId:", userId);
      user = await UserModel.findById(userId).select("-password");
    } else {
      // If not ObjectId, search by email
      console.log("🔍 Searching by email:", userId);
      user = await UserModel.findOne({ email: userId }).select("-password");
    }

    if (!user) {
      console.log("❌ User not found with identifier:", userId);
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    console.log("✅ User found:", user.email);

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// PUT — Update logged-in user's own profile
export async function PUT(request) {
  try {
    await connectDB();

    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Updating profile for user ID:", userId);

    const formData = await request.formData();
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const avatarFile = formData.get("avatar");

    console.log("📝 FormData received:", {
      name,
      phone,
      address,
      hasAvatar: !!avatarFile,
    });

    let user;

    // Check if userId is a valid ObjectId
    if (isValidObjectId(userId)) {
      user = await UserModel.findById(userId);
    } else {
      user = await UserModel.findOne({ email: userId });
    }

    if (!user) {
      console.log("❌ User not found with identifier:", userId);
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update basic fields
    if (name) user.name = name;
    if (phone !== null) user.phone = phone;
    if (address !== null) user.address = address;

    // Handle avatar upload
    if (avatarFile && avatarFile.size > 0) {
      console.log("🖼️ Uploading new avatar...");

      try {
        const bytes = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await uploadToCloudinary(
          buffer,
          "byteStore/users"
        );

        // Delete old avatar if exists
        if (user.avatar?.public_id) {
          try {
            await deleteFromCloudinary(user.avatar.public_id);
            console.log("🗑️ Old avatar deleted");
          } catch (err) {
            console.warn("⚠️ Error deleting old avatar:", err.message);
          }
        }

        user.avatar = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        };

        console.log("✅ New avatar uploaded:", uploadResult.secure_url);
      } catch (uploadError) {
        console.error("❌ Avatar upload failed:", uploadError.message);
        console.log("⚠️ Profile updated without avatar");
        // Continue without avatar - don't fail the entire update
      }
    }

    await user.save();

    // Get updated user
    let updatedUser;
    if (isValidObjectId(userId)) {
      updatedUser = await UserModel.findById(userId).select("-password");
    } else {
      updatedUser = await UserModel.findOne({ email: userId }).select(
        "-password"
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        isEmailVerified: updatedUser.isEmailVerified,
        phone: updatedUser.phone,
        address: updatedUser.address,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}
