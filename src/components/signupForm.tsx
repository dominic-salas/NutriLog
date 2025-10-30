"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, signInWithGoogle } from "@/lib/utils/auth-actions";

function SignupFormContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) 
{
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* background pic */}
      <div className="absolute inset-0 bg-[#0b0b0b]" />
      <Image
        src="/food.jpg"
        alt="Food background"
        fill
        priority
        className="object-cover opacity-20"
      />
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-emerald-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-lime-300/25 blur-3xl" />
      <div className="pointer-events-none absolute top-24 right-10 h-24 w-24 rounded-full bg-emerald-200/30 blur-xl" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 sm:p-8 text-white shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/25 via-transparent to-white/10 opacity-60" />

          {/* header */}
          <div className="relative z-10 mb-6 flex items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Utensils className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">NutriLog</span>
          </div>

          {/* form */}
          <Form
            action={signup}
            className={cn("relative z-10 flex flex-col gap-6", className)}
            {...props}
          >
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h1 className="text-2xl font-bold">Create account</h1>
              <p className="text-sm text-white/70">
                Start tracking your meals and macros.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-white/85">
                    First Name
                  </Label>
                  <Input
                    id="first-name"
                    name="first-name"
                    type="text"
                    required
                    className="h-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-white/85">
                    Last Name
                  </Label>
                  <Input
                    id="last-name"
                    name="last-name"
                    type="text"
                    required
                    className="h-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/85">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/85">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="h-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white/85">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="h-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
                />
              </div>

              {/* btn */}
              <Button
                type="submit"
                size="lg"
                className="h-11 w-full rounded-xl border-0 bg-gradient-to-r from-lime-400/85 to-emerald-500/85 font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:from-lime-400 hover:to-emerald-500"
              >
                Sign up
              </Button>

              {/* divider */}
              <div className="relative text-center text-sm text-white/70 before:absolute before:left-0 before:top-1/2 before:w-full before:border-t before:border-white/15">
                <span className="relative bg-transparent px-2">or</span>
              </div>

              {/* google Button */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => signInWithGoogle()}
                className="h-11 w-full rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/15"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* login link */}
              <p className="text-center text-sm text-white/75">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen w-full overflow-hidden">
          <div className="absolute inset-0 bg-[#0b0b0b]" />
          <Image
            src="/food.jpg"
            alt="Food background"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="relative flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-8 text-white backdrop-blur-2xl">
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white/80" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SignupFormContent className={className} {...props} />
    </Suspense>
  );
}
