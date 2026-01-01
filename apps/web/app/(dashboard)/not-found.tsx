"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  ArrowLeft,
  Search,
  Users,
  Building2,
  Megaphone,
  FileQuestion,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function DashboardNotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const quickLinks = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
      description: "Return to main dashboard",
    },
    {
      href: "/users",
      icon: Users,
      label: "Users",
      description: "Manage users and admins",
    },
    {
      href: "/facilities",
      icon: Building2,
      label: "Facilities",
      description: "View healthcare facilities",
    },
    {
      href: "/marketing",
      icon: Megaphone,
      label: "Marketing",
      description: "Manage campaigns",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement actual search logic here
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      {/* 404 Illustration */}
      <div className="relative mb-8">
        <div className="text-[120px] md:text-[180px] font-black text-gray-200 dark:text-gray-800 leading-none select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FileQuestion className="w-16 h-16 md:w-24 md:h-24 text-gray-400 animate-pulse" />
        </div>
      </div>

      {/* Main Message */}
      <div className="text-center max-w-2xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          The page you're looking for doesn't exist yet or may have been moved.
          This feature might be under development.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-md mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a page or feature..."
            className="pl-10 pr-4 py-6 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Button
          onClick={() => router.push("/dashboard")}
          size="lg"
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Button>
      </div>

      {/* Quick Links */}
      <div className="w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className="group relative flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-center">
                  {link.label}
                </h3>
                <p className="text-xs text-muted-foreground text-center">
                  {link.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Need help?{" "}
          <button
            onClick={() => router.push("/support")}
            className="text-primary hover:underline"
          >
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
}
