"use client";

import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EmailVerification = ({ params }) => {
  const router = useRouter();
  const { token } = use(params);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const { data: verificationResponse } = await axios.post(
          "/api/test/auth/verify-email",
          { token }
        );

        if (verificationResponse.success) {
          setIsVerified(true);
          router.push("/login");
        }
      } catch (error) {
        console.error("Verification failed", error);
        setIsVerified(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px] shadow-lg">
        <CardContent className="p-6">
          {isVerified ? (
            <div className="flex flex-col justify-center items-center">
              <Image
                src="https://i.ibb.co.com/SwknnzHC/verified.gif"
                height={100}
                width={100}
                alt="Email Verification successful"
              />

              <h3 className="text-green-500 mt-4 mb-2 text-lg font-semibold">
                Email Verification Successful 🎉
              </h3>

              <Button asChild>
                <Link href="/"> Go home </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <Image
                src="https://i.ibb.co.com/dwD3gMF6/verification-failed.gif"
                height={100}
                width={100}
                alt="Email Verification failed"
              />
              <h3 className="text-red-500 mt-4 mb-2 text-lg font-semibold">
                Email Verification Failed ❌
              </h3>

              <Button asChild>
                <Link href="/"> Go home </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
