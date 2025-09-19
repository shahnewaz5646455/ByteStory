"use client";

import React, { useState } from "react";
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

const OtpVerification = ({ email, onSubmit, loading }) => {
  const [isResendOtp, setIsResendOpt] = useState(false);

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
      setIsResendOpt(true);

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
    } finally {
      setIsResendOpt(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-center mb-4">OTP Verification</h3>
      <p className="text-center mb-6">
        Enter the 6-digit verification code sent to <strong>{email}</strong>.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitOtp)}
          className="space-y-4"
        >
          {/* Hidden email field */}
          <input type="hidden" {...form.register("email")} />

          {/* OTP input */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One Time Password (OTP)</FormLabel>
                <FormControl>
                  <InputOTP
                    value={field.value}
                    onChange={field.onChange}
                    maxLength={6}
                  >
                    <InputOTPGroup className="w-full flex justify-between">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>

          <div className="text-center mt-4">
            {!isResendOtp ? (
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={resendOTP}
              >
                Resend OTP
              </button>
            ) : (
              <span>Resending...</span>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OtpVerification;
