// import UserModel from "@/models/User";
import UserModel from "@/app/models/User.model";
import { connectDB } from "@/lib/database.Connection";
import { NextResponse } from "next/server";

// GET all users OR single user with query param
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    // If ID provided, return single user
    if (userId) {
      const user = await UserModel.findById(userId).select("-password");

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: JSON.parse(JSON.stringify(user)),
      });
    }

    // Otherwise return all users
    const users = await UserModel.find({ deletedAt: null })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users: JSON.parse(JSON.stringify(users)),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// UPDATE user with query parameter
export async function PUT(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, role, phone, address, isEmailVerified } = body;

    // Check if email already exists for other users
    if (email) {
      const existingUser = await UserModel.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        // name,
        // email,
        role,
        // phone,
        // address,
        // isEmailVerified,
        // updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: JSON.parse(JSON.stringify(updatedUser)),
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE user with query parameter
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Soft delete - set deletedAt timestamp
    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
