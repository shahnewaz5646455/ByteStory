"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, Eye, EyeOff, Shield, CheckCircle, ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { zSchema } from "@/lib/zodSchema";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdatePassword({ email }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const formSchema = zSchema
    .pick({
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
      email: email,
      password: "",
      confirmPassword: "",
    },
  });

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPasswordStrength(checkPasswordStrength(password));
    form.setValue("password", password);
  };

  const handleUpdatePassword = async (values) => {
    try {
      setLoading(true);
      const { data: passwordUpdate } = await axios.post(
        "/api/test/auth/reset-password/update-password",
        values
      );
      if (!passwordUpdate.success) {
        throw new Error(passwordUpdate.message);
      }
      form.reset();
      showToast("success", passwordUpdate.message);
      router.push("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Password update failed";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength) => {
    if (strength <= 1) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="">
      <div className="max-w-md w-full">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
        <Card className="w-full overflow-hidden shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                New Password
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Create a strong password for your account
              </p>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 inline-flex">
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdatePassword)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            className="pl-11 pr-11 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            {...field}
                            onChange={handlePasswordChange}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      {form.watch("password") && (
                        <div className="space-y-2 mt-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Password strength</span>
                            <span className={`font-medium ${
                              passwordStrength <= 1 ? "text-red-500" :
                                passwordStrength <= 3 ? "text-yellow-500" : "text-green-500"
                              }`}>
                              {getPasswordStrengthText(passwordStrength)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                getPasswordStrengthColor(passwordStrength)
                                }`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            className="pl-11 pr-11 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-200 rounded-xl"></div>
                  {loading ? (
                    <div className="flex items-center gap-2 relative z-10">
                      <Loader2 className="animate-spin w-5 h-5" />
                      Updating...
                    </div>
                  ) : (
                    <span className="relative z-10 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Update Password
                    </span>
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Password Requirements
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    form.watch("password")?.length >= 8 ? "bg-green-500" : "bg-blue-300"
                    }`}></div>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    /[A-Z]/.test(form.watch("password")) ? "bg-green-500" : "bg-blue-300"
                    }`}></div>
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    /[0-9]/.test(form.watch("password")) ? "bg-green-500" : "bg-blue-300"
                    }`}></div>
                  One number
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    /[^A-Za-z0-9]/.test(form.watch("password")) ? "bg-green-500" : "bg-blue-300"
                    }`}></div>
                  One special character
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}