import UserModel from "@/app/models/User.model";
import { connectDB } from "@/lib/database.Connection";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const user = await UserModel.findById(id).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
