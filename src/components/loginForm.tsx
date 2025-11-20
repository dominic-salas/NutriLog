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
import { login } from "@/lib/utils/auth-actions";

function LoginFormContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Dark base + bg image */}
      <div className="absolute inset-0 bg-[#0b0b0b]" />
      <Image
        src="/food.jpg"
        alt="Food background"
        fill
        priority
        className="object-cover opacity-20"
      />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-emerald-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-lime-300/25 blur-3xl" />
      <div className="pointer-events-none absolute top-24 right-10 h-24 w-24 rounded-full bg-emerald-200/30 blur-xl" />

      {/* Center */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        {/* Glass card */}
        <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 sm:p-8 text-white shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          {/* glossy sheen */}
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
            action={login}
            className={cn("relative z-10 flex flex-col gap-6", className)}
            {...props}
          >
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h1 className="text-2xl font-bold">Login</h1>
              <p className="text-sm text-white/70">
                Welcome back... please sign in to your account.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-5">
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
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white/85">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="ml-auto text-sm text-white/70 hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
                />
              </div>

              {/* CTA */}
              <Button
                type="submit"
                size="lg"
                className="h-11 w-full rounded-xl border-0 bg-gradient-to-r from-lime-400/85 to-emerald-500/85 font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:from-lime-400 hover:to-emerald-500"
              >
                Log in
              </Button>

              {/* signup link */}
              <p className="text-center text-sm text-white/75">
                Don’t have an account?{" "}
                <Link href="/signup" className="text-white hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export function LoginForm({
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
      <LoginFormContent className={className} {...props} />
    </Suspense>
  );
}
