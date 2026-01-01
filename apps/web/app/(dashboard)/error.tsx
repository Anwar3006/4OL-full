"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      {/* Error Icon */}
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>

      {/* Error Message */}
      <div className="text-center max-w-2xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Something Went Wrong
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          We encountered an unexpected error. Don't worry, it's not your fault.
        </p>
        {error.message && (
          <p className="text-sm text-muted-foreground font-mono bg-muted p-3 rounded-lg mt-4">
            {error.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={() => router.refresh()}
          variant="default"
          size="lg"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button
          onClick={() => router.push("/dashboard")}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Button>
      </div>

      {/* Error ID */}
      {error.digest && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Error ID: {error.digest}</p>
          <p className="text-xs mt-1">
            Share this ID with support if you need help
          </p>
        </div>
      )}
    </div>
  );
}
