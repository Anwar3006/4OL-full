"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

export default function GlobalNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-muted/20">
      {/* 404 Illustration */}
      <div className="relative mb-8">
        <div className="text-[150px] md:text-[220px] font-black text-gray-200 dark:text-gray-800 leading-none select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FileQuestion className="w-20 h-20 md:w-32 md:h-32 text-gray-400 animate-pulse" />
        </div>
      </div>

      {/* Main Message */}
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you're looking for doesn't exist. It might have been moved,
          deleted, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
          <Button
            onClick={() => router.push("/dashboard/overview")}
            size="lg"
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Button>
        </div>
      </div>

      {/* Error Code */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Error Code: 404 - Page Not Found</p>
      </div>
    </div>
  );
}
