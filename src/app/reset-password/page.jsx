"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { showToast } from "@/lib/showToast";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Mail, Loader2, ArrowLeft, Shield, KeyRound } from "lucide-react";
import { zSchema } from "@/lib/zodSchema";
import OtpVerification from "@/components/ui/Application/OtpVerification";
import Link from "next/link";
import UpdatePassword from "@/components/ui/Application/UpdatePassword";

const ResetPassword = () => {
  const dispatch = useDispatch();

  const [emailVerificationLoading, setEmailVerification] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState();
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const formSchema = zSchema.pick({ email: true });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  // Verify OTP
  const otpVerificationSubmit = async (values) => {
    try {
      setOtpVerifyLoading(true);
      const { data: otpResponse } = await axios.post(
        "/api/test/auth/reset-password/send-otp/verify-otp",
        values
      );
      if (!otpResponse.success) throw new Error(otpResponse.message);

      showToast("success", otpResponse.message);
      setIsOtpVerified(true);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setOtpVerifyLoading(false);
    }
  };

  // Send OTP
  const handleResetPassword = async (values) => {
    try {
      setEmailVerification(true);
      const { data } = await axios.post(
        "/api/test/auth/reset-password/send-otp",
        values
      );
      if (!data.success) throw new Error(data.message);

      setOtpEmail(values.email);
      form.reset();
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setEmailVerification(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-md w-full">
        {/* যদি OTP verify হয়ে যায় */}
        {isOtpVerified ? (
          <UpdatePassword email={otpEmail} />
        ) : (
          <>
            {/* Back Button */}
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
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Reset password screen */}
                {!otpEmail ? (
                  <>
                    <div className="mb-8 text-center">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Reset Password
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Enter your email address and we'll send you an OTP to
                        reset your password
                      </p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleResetPassword)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                  <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={emailVerificationLoading}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-200 rounded-xl"></div>
                          {emailVerificationLoading ? (
                            <div className="flex items-center gap-2 relative z-10">
                              <Loader2 className="animate-spin w-5 h-5" />
                              Sending OTP...
                            </div>
                          ) : (
                            <span className="relative z-10 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Send OTP
                            </span>
                          )}
                        </Button>
                      </form>
                    </Form>

                    {/* Security Tip */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                            Security Tip
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Check your spam folder if you don't receive the OTP
                            within a few minutes
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // OTP Verification screen
                  <OtpVerification
                    email={otpEmail}
                    onSubmit={otpVerificationSubmit}
                    loading={otpVerifyLoading}
                  />
                )}
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need help?{" "}
                <Link
                  href="/support"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Contact support
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
