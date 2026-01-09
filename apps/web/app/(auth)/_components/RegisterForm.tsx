"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";

import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/CustomInput";

import * as zod from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  TUserProfile,
  TUserProfileRegistrationInput,
  userRegistrationSchema,
} from "@4ol/db/schemas/user-profile.schema";
import { Form } from "@/components/ui/form";
import CustomSelect from "@/components/CustomSelect";
import CustomDatePicker from "@/components/CustomDatePicker";
import { ROLE_OPTIONS, SEX_OPTIONS } from "@4ol/db/types/formInput";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useCreateUserProfile } from "@/hooks/supabase-calls/useUser";

const RegisterForm = ({
  isInvited = false,
  inviteData,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  isInvited?: boolean;
  inviteData?: { email: string; role: string };
}) => {
  const form = useForm<zod.infer<typeof userRegistrationSchema>>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: inviteData?.email || "",
      sex: "" as "male" | "female" | "other",
      dob: "",
      password: "",
      confirmPassword: "",
      role: (inviteData?.role as TUserProfile["role"]) || "user",
      phoneNumber: "",
      userType: "customer",
    },
  });
  const router = useRouter();

  // useEffect(() => {
  //   if (isInvited && inviteData) {
  //     form.setValue("email", inviteData.email);
  //     form.setValue("role", inviteData.role as TUserProfile["role"]);
  //   }
  // }, [isInvited, form]);

  //============= tRPC mutation for profile creation
  const { mutateAsync, isPending } = useCreateUserProfile();
  //===================================

  const handleSubmit = async (data: TUserProfileRegistrationInput) => {
    console.log("handle submit click ");
    try {
      // Step 1: Create auth user with Better Auth
      const authResult = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
      });

      if (authResult.error) {
        form.setError("root", { message: authResult.error.message });
        return;
      }

      // 2. Create user profile with hook
      await mutateAsync({
        userId: authResult.data.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        sex: data.sex,
        dob: data.dob,
        phoneNumber: data.phoneNumber,
        role: data.role,
        userType: data.userType,
      });

      // Step 3: Redirect to dashboard
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Error registering user: ", error);
      toast.error("Registration failed! : " + (error as Error).message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            {/* Title */}
            <h1 className="text-2xl font-bold">
              {isInvited
                ? "Administrative Account Setup"
                : "Create your account"}
            </h1>

            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to create an account
            </p>
          </div>

          {/* First name and last name */}
          <div className="grid grid-cols-2 gap-5">
            <CustomInput
              type="text"
              name="firstName"
              label="First Name"
              placeholder="Francis Neizer"
              control={form.control}
              disabled={false}
              readOnly={false}
            />

            <CustomInput
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Mensah"
              control={form.control}
              disabled={false}
              readOnly={false}
            />
          </div>

          {/* Sex and DOB */}
          <div className="grid grid-cols-2 gap-5">
            <CustomSelect
              name="sex"
              label="Sex"
              placeholder="Select sex"
              options={SEX_OPTIONS}
              control={form.control}
              description="Your biological sex"
            />

            <CustomDatePicker
              name="dob"
              label="Date of Birth"
              control={form.control}
              description="Must be 18 years or older"
            />
          </div>

          {/* Email */}
          <CustomInput
            type="email"
            name="email"
            label="Email Address"
            placeholder="francis@gmail.com"
            control={form.control}
            description="This email address will be your primary form of contact.
              Periodically check your inbox."
            disabled={isInvited} //disable if invited
            readOnly={isInvited}
          />

          {/* Phone Number */}
          <CustomInput
            type="text"
            name="phoneNumber"
            label="Phone Number"
            placeholder="+233 55 555 5555"
            control={form.control}
            description="We will use this to contact you if need be. Make sure it is accessible."
            disabled={false}
            readOnly={false}
          />

          {/* Role */}
          <CustomSelect
            name="role"
            label="Your Role"
            options={ROLE_OPTIONS}
            control={form.control}
            description="You have been assigned this role by the Administrator."
            disabled={isInvited}
          />

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-5">
            <CustomInput
              type="password"
              name="password"
              label="Password"
              placeholder="***********"
              control={form.control}
              disabled={false}
              readOnly={false}
            />
            <CustomInput
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="***********"
              control={form.control}
              disabled={false}
              readOnly={false}
            />
          </div>

          <Field>
            <Button
              type="submit"
              className="py-5 bg-emerald-600"
              disabled={isPending}
              onClick={() => {
                console.log("I am clicked but: ", form.formState.errors);
              }}
            >
              {isPending ? "Creating..." : "Register an Account"}
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field>
            <FieldDescription className="px-6 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-emerald-600">
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default RegisterForm;
