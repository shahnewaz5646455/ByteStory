"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
import { Button } from "../button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../form";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "../input-otp";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { Shield, Mail, RotateCcw, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

const OtpVerification = ({ email, onSubmit, loading }) => {
  const [isResendOtp, setIsResendOtp] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Pick otp and email for the form
  const formSchema = zSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email || "",
    },
  });

  const handleSubmitOtp = (values) => {
    onSubmit(values);
  };

  const resendOTP = async () => {
    try {
      setIsResendOtp(true);
      setCanResend(false);
      setCountdown(60);

      const { data: registerResponse } = await axios.post(
        "/api/test/auth/resend-otp",
        { email }
      );

      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }

      showToast("success", registerResponse.message);
    } catch (error) {
      showToast("error", error.message);
      setCanResend(true);
    } finally {
      setIsResendOtp(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        
        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
          Verify Your Account
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          We sent a 6-digit code to
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <Mail className="w-4 h-4" />
          <span className="font-semibold">{email}</span>
        </div>
      </div>

      {/* OTP Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitOtp)}
          className="space-y-6"
        >
          {/* Hidden email field */}
          <input type="hidden" {...form.register("email")} />

          {/* OTP Input */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter verification code
                </FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP
                      value={field.value}
                      onChange={field.onChange}
                      maxLength={6}
                      className="gap-2"
                    >
                      <InputOTPGroup className="gap-3">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot 
                            key={index} 
                            index={index}
                            className="w-14 h-14 text-lg font-semibold border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 data-[state=active]:border-indigo-500 data-[state=active]:ring-2 data-[state=active]:ring-indigo-200 dark:data-[state=active]:ring-indigo-800" 
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage className="text-center text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Verify Button */}
          <Button
            type="submit"
            disabled={loading || form.watch("otp")?.length !== 6}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-200 rounded-xl"></div>
            {loading ? (
              <div className="flex items-center gap-2 relative z-10">
                <Loader2 className="animate-spin w-5 h-5" />
                Verifying...
              </div>
            ) : (
              <span className="relative z-10 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Verify Code
              </span>
            )}
          </Button>
        </form>
      </Form>

      {/* Resend OTP Section */}
      <div className="mt-8 text-center">
        <div className="space-y-3">
          {!canResend ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Resend code in <span className="font-semibold text-indigo-600">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={resendOTP}
              disabled={isResendOtp}
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResendOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Resend verification code
                </>
              )}
            </button>
          )}
          
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Didn't receive the code? Check your spam folder
          </p>
        </div>
      </div>

      {/* Security Note */}
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              Security Notice
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              This code will expire in 10 minutes. Do not share it with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;