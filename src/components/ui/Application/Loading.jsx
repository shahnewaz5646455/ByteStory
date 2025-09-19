"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-fit shadow-lg border rounded-2xl">
        <CardContent className="flex flex-col justify-center items-center p-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Loading, please wait...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;
