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
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Mail, Loader2 } from "lucide-react";
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

      // Optional: log in user after successful OTP verification
      //   dispatch(login(otpResponse.data));
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

      setOtpEmail(values.email); // show OTP input
      form.reset();
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setEmailVerification(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Card className="max-w-md w-full overflow-hidden shadow-xl">
        <CardContent className="p-8">
          {!otpEmail ? (
            <>
              {/* Heading */}
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                <p className="text-sm">Enter your Email to receive OTP</p>
              </div>

              {/* Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleResetPassword)}
                  className="space-y-4"
                >
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

                  <Button
                    type="submit"
                    disabled={emailVerificationLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition duration-150 flex justify-center cursor-pointer"
                  >
                    {emailVerificationLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Sending OTP...
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </form>
              </Form>

              {/* Back to login */}
              <p className="text-sm text-center mt-4">
                <Link href="/login" className="underline hover:text-indigo-600">
                  Back to login
                </Link>
              </p>
            </>
          ) : (
            <>
              {!isOtpVerified ? (
                <OtpVerification
                  email={otpEmail}
                  onSubmit={otpVerificationSubmit}
                  loading={otpVerifyLoading}
                />
              ) : (
                <UpdatePassword email={otpEmail} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
