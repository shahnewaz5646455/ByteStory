"use client";

import { Lightbulb } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-ping opacity-75"></div>
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;