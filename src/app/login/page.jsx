"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { zSchema } from "@/lib/zodSchema";
import z from "zod";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // Handle submit
  const handleLoginSubmit = async (values) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="max-w-md w-full overflow-hidden shadow-xl">
        <CardContent className="p-8 ">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Sign in
            </h3>
            <p className="text-sm text-slate-600">
              Use your email or continue with Google
            </p>
          </div>

          {/* Google Button */}
          <Button
            onClick={() => signIn("google")}
            className="w-full flex items-center gap-2 cursor-pointer bg-white text-gray-800 border-2 border-indigo-100 font-semibold px-6 py-3 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition duration-300 justify-center"
            variant="outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24"
              height="24"
            >
              <path
                fill="#4285F4"
                d="M23.64 12.2c1.99 0 3.34.86 4.12 1.58l3.03-3.03C29.12 9.44 26.66 8 23.64 8 14.91 8 8 14.91 8 23.64s6.91 15.64 15.64 15.64c8.97 0 14.82-6.29 14.82-15.14 0-1.03-.11-1.79-.28-2.56H23.64v4.82h7.96c-.33 2-2.31 5.82-7.96 5.82-4.84 0-8.75-4.05-8.75-9s3.91-9 8.75-9z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Separator */}
          <div className="flex items-center gap-3 my-4">
            <Separator className="flex-1" />
            <span className="text-xs text-slate-500">or</span>
            <Separator className="flex-1" />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
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
                <a
                  href="/forgot"
                  className="text-sm underline hover:text-indigo-600"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition duration-150 flex justify-center"
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
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <a className="underline hover:text-indigo-600" href="/register">
              Create account
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
