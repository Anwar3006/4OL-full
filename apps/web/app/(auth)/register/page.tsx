"use client";
import React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 h-[98vh] overflow-y-scroll">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="/register"
            className="flex items-center gap-2 font-medium underline underline-offset-3"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            4 Our Life.
          </a>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>

      <div className="bg-green-200 relative hidden lg:block h-full">
        <img
          src="/placeholder.svg"
          alt="placeholder"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
