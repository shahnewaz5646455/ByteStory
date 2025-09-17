import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ButtonLoading({
  type,
  text,
  className,
  loading,
  onclick,
  ...props
}) {
  return (
    <Button
      type={type}
      disabled={loading}
      onclick={onclick}
      {...props}
      className={cn("", className)}
    >
      {loading && <Loader2Icon className="animate-spin" />}
      {text}
    </Button>
  );
}
