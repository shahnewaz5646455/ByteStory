// app/models/EmailTemplate.model.js
import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: [
        "business",
        "sales",
        "customer-service",
        "follow-up",
        "networking",
        "job-application",
        "meeting",
        "thank-you",
        "apology",
        "announcement",
      ],
    },
    tone: {
      type: String,
      enum: ["professional", "friendly", "formal", "casual", "persuasive"],
      default: "professional",
    },
    keyPoints: [
      {
        type: String,
        trim: true,
      },
    ],
    generatedEmail: {
      subject: String,
      body: String,
      closing: String,
    },
    wordCount: Number,
    language: {
      type: String,
      default: "english",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "email_templates",
  }
);

// Index for better performance
emailTemplateSchema.index({ userId: 1, createdAt: -1 });
emailTemplateSchema.index({ purpose: 1 });

const EmailTemplateModel =
  mongoose.models.EmailTemplate ||
  mongoose.model("EmailTemplate", emailTemplateSchema);
export default EmailTemplateModel;
