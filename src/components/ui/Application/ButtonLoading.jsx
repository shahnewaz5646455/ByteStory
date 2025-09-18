"use client";

import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ButtonLoading({
  type = "button",
  text,
  className,
  loading = false,
  onClick,
  ...props
}) {
  return (
    <Button
      type={type}
      disabled={loading}
      onClick={onClick} // ✅ fixed
      {...props}
      className={cn("", className)}
    >
      {loading && <Loader2Icon className="animate-spin mr-2" />}
      {text}
    </Button>
  );
}
