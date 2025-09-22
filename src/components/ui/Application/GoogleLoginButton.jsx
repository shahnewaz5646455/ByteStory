import { FlagOffIcon } from "lucide-react";
import Link from "next/link";
// import { FaGoogle } from "react-icons/fa";

export default function GoogleLoginButton() {
  return (
    <Link
      href="/api/test/auth/google"
      className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
    >
      <FlagOffIcon className="text-red-500" />
      Continue with Google
    </Link>
  );
}
