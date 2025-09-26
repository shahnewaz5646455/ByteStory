import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    avatar: {
      url: { type: String, trim: true },
      public_id: { type: String, trim: true },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
    // Add these fields for OAuth support
    provider: {
      type: String,
      default: "credentials", // 'google' for Google OAuth
    },
    providerId: {
      type: String, // Google's user ID
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// 🔒 password hashing with the help of bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 compare password - only if password exists
userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

// ✅ FIXED MODEL CREATION
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
