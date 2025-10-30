"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Icons
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import { zSchema } from "@/lib/zodSchema";
import z from "zod";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import OtpVerification from "@/components/ui/Application/OtpVerification";
import { useDispatch } from "react-redux";
// import GoogleG from "../../../components/GoogleG";
import { GoogleLogin } from "@react-oauth/google";
import { login } from "@/store/reducer/authReducer";

function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState();

  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min("3", "password field is required"),
    });

  // React Hook Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle submit login
  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true);

      const { data: registerResponse } = await axios.post(
        "/api/test/auth/login",
        values
      );

      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }

      setOtpEmail(values.email);
      form.reset();
      showToast("success", registerResponse.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // otp verification
  const otpVerificationSubmit = async (values) => {
    try {
      setOtpVerifyLoading(true);

      const { data: otpResponse } = await axios.post(
        "/api/test/auth/verify-otp",
        values
      );

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }

      showToast("success", otpResponse.message);
      dispatch(login(otpResponse.data));
      setOtpEmail("");

      if (searchParams.has("callback")) {
        router.push(searchParams.get("callback"));
      } else {
        otpResponse.data.role === "admin"
          ? router.push("/admin/adminDashboard/overview")
          : router.push("/website/my-account");
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setOtpVerifyLoading(false);
    }
  };

  // Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const { data: googleResponse } = await axios.post(
        "/api/test/auth/google",
        { credential: credentialResponse.credential }
      );

      console.log(googleResponse, "google login");
      if (!googleResponse.success) {
        throw new Error(googleResponse.message);
      }

      // Store user in Redux
      dispatch(login(googleResponse.data));

      // Show success toast
      showToast("success", googleResponse.message || "Logged in successfully");

      // Redirect logic
      if (searchParams.has("callback")) {
        router.push(searchParams.get("callback"));
      } else {
        googleResponse.data.role === "admin"
          ? router.push("/admin/adminDashboard/overview")
          : router.push("/website/my-account");
      }
    } catch (error) {
      showToast("error", error.message || "Google login failed");
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 p-4">
      <Card className="max-w-md w-full overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-8">
          {!otpEmail ? (
            <>
              {/* Heading */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back
                </h2>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Sign in
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Use your email or continue with Google
                </p>
              </div>

              {/* Google Button */}

              <div className="flex justify-center mb-6">
                <div>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      showToast("error", "Google login failed");
                      console.log("Google Login Failed");
                    }}
                    text="continue_with"
                    size="large"
                    width="320"
                    shape="rectangular"
                    logo_alignment="center"
                  />
                </div>
              </div>

              {/* Separator */}
              <div className="flex items-center gap-3 my-6">
                <Separator className="flex-1 bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  or
                </span>
                <Separator className="flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Login Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleLoginSubmit)}
                  className="space-y-4"
                >
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Forgot password */}
                  <div className="flex items-center justify-between">
                    <Link
                      href="/reset-password"
                      className="text-sm text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex justify-center"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign in with Email"
                    )}
                  </Button>
                </form>
              </Form>

              {/* Register link */}
              <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </>
          ) : (
            <>
              <OtpVerification
                email={otpEmail}
                onSubmit={otpVerificationSubmit}
                loading={otpVerifyLoading}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
