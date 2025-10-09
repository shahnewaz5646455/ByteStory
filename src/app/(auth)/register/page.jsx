"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useState } from "react";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// icons
import { Mail, Lock, User, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import { zSchema } from "@/lib/zodSchema";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import GoogleG from "../../../../components/GoogleG";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ Form schema setup
  const formSchema = zSchema
    .pick({
      name: true,
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ✅ Email-based registration
  const handleRegister = async (values) => {
    try {
      setLoading(true);

      const { data: registerResponse } = await axios.post(
        "/api/test/auth/register",
        values
      );

      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }

      form.reset();
      showToast("success", registerResponse.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google-based registration/login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const { data: googleResponse } = await axios.post(
        "/api/test/auth/google",
        { credential: credentialResponse.credential }
      );

      if (!googleResponse.success) {
        throw new Error(googleResponse.message);
      }

      // Store user in Redux
      dispatch(login(googleResponse.data));

      // Show success message
      showToast("success", googleResponse.message || "Logged in successfully");

      // Redirect based on role
      if (googleResponse.data.role === "admin") {
        router.push("/admin/adminDashboard/overview");
      } else {
        router.push("/website/my-account");
      }
    } catch (error) {
      showToast("error", error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create your account
            </h2>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Sign up
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Sign up with email or continue with Google
            </p>
          </div>

          {/* ✅ Google Register Button (Now Fully Functional) */}
          <div className="w-full flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showToast("error", "Google login failed")}
              shape="rectangular"
              text="continue_with"
              width="320"
            />
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 my-6">
            <Separator className="flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
            <Separator className="flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Registration Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <Input
                          placeholder="Your name"
                          className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          placeholder="you@example.com"
                          type="email"
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
                          className="pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          className="pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          {showConfirmPassword ? (
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

              {/* Register button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex justify-center"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Registering...
                  </div>
                ) : (
                  "Sign up with Email"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
