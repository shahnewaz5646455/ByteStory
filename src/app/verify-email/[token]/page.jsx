"use client";

import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { showToast } from "@/lib/showToast";
import { Loader2 } from "lucide-react";

const EmailVerification = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = use(params);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        console.log("Verifying token:", token);

        const { data: verificationResponse } = await axios.post(
          "/api/test/auth/verify-email",
          { token }
        );

        console.log("Verification response:", verificationResponse);

        if (verificationResponse.success) {
          // Auto-login user after verification
          dispatch(login(verificationResponse.data));
          setIsVerified(true);
          showToast("success", verificationResponse.message);

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            const redirectPath =
              verificationResponse.data.role === "admin"
                ? "/admin/adminDashboard/overview"
                : "/website/my-account";
            window.location.href = redirectPath;
          }, 2000);
        } else {
          throw new Error(verificationResponse.message);
        }
      } catch (error) {
        console.error("Verification failed", error);
        setIsVerified(false);
        showToast(
          "error",
          error.response?.data?.message || "Verification failed"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verify();
    } else {
      setLoading(false);
      setIsVerified(false);
    }
  }, [token, dispatch]);

  // Loading State - Verification
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-[400px] shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Verifying Your Email
            </h3>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success State - Verification Successful
  if (isVerified) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-[400px] shadow-lg">
          <CardContent className="p-6 text-center">
            <Image
              src="https://i.ibb.co.com/SwknnzHC/verified.gif"
              height={100}
              width={100}
              alt="Email Verification successful"
              className="mx-auto mb-4"
            />
            <h3 className="text-green-500 mb-2 text-lg font-semibold">
              Email Verification Successful 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Your email has been verified. Redirecting to dashboard...
            </p>
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span className="text-sm text-gray-500">Redirecting...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State - Verification Failed
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px] shadow-lg">
        <CardContent className="p-6 text-center">
          <Image
            src="https://i.ibb.co.com/dwD3gMF6/verification-failed.gif"
            height={100}
            width={100}
            alt="Email Verification failed"
            className="mx-auto mb-4"
          />
          <h3 className="text-red-500 mb-2 text-lg font-semibold">
            Email Verification Failed ❌
          </h3>
          <p className="text-gray-600 mb-4">
            The verification link is invalid or has expired.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
