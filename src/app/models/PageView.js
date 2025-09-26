import mongoose from "mongoose";

// This model tracks every page visit
const pageViewSchema = new mongoose.Schema(
  {
    // Connect to the visitor who viewed the page
    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },

    // Which page was visited
    page: {
      type: String,
      required: true,
    },

    // How long they stayed on the page (in seconds)
    duration: {
      type: Number,
      default: 0,
    },

    // Where they came from
    referrer: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PageView ||
  mongoose.model("PageView", pageViewSchema);
