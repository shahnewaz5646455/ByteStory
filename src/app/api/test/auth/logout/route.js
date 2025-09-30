import { connectDB } from "@/lib/database.Connection";
import { response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST() {
  try {
    await connectDB();

    const cookieStore = cookies();
    cookieStore.delete("access-token");

    return response(true, 200, "Logout successful");
  } catch (error) {
    // console.error("Logout error:", error);
    return response(false, 500, "Internal server error", error.message);
  }
}
