import UserModel from "@/app/models/User.model";
import { connectDB } from "@/lib/database.Connection";
import { NextResponse } from "next/server";

// GET all users
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

    // Return all active users
    const users = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 });

    console.log(`Found ${users.length} users in database`);

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

// UPDATE user
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
        name,
        email,
        role,
        phone,
        address,
        isEmailVerified,
        updatedAt: new Date(),
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

// DELETE user - HARD DELETE
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

    console.log(`Deleting user with ID: ${userId}`);

    // HARD DELETE - Remove from database completely
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    console.log(`User ${userId} deleted successfully`);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully from database",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
