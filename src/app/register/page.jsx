"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

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
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { zSchema } from "@/lib/zodSchema";
import axios from "axios";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // const handleRegister = async (values) => {
  //   try {
  //     setLoading(true);
  //     const { data: registerResponse } = await axios.post(
  //       "api/test/auth/register",
  //       values
  //     );
  //     if (!registerResponse.success) {
  //       throw new error(registerResponse.message);
  //     }

  //     form.reset();
  //     alert(registerResponse.success);
  //   } catch (error) {
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      alert(registerResponse.message || "Registration successful!");
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="max-w-md w-full shadow-xl">
        <CardContent className="p-8">
          <div className="mb-2 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-1 text-gray-900">
              Create your account
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Sign up
            </h3>
            <p className="text-sm text-slate-600">
              Sign up with email or continue with Google
            </p>
          </div>

          {/* Google Button */}
          <Button
            onClick={() => signIn("google")}
            className="w-full flex items-center gap-2 bg-white text-gray-800 border-2 border-indigo-100 font-semibold px-6 py-3 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition justify-center"
            variant="outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="30"
              height="30"
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

          {/* Registration Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className="space-y-3"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="Your name"
                          className="pl-10"
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="you@example.com"
                          type="email"
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
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
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
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition flex"
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

          <p className="text-sm text-center mt-3">
            Already have an account?{" "}
            <a className="underline hover:text-indigo-600" href="/login">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
