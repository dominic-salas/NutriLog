"use client";

import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signInWithGoogle } from "@/lib/utils/auth-actions";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) 
{
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* background pic */}
      <Image
        src="/food.jpg"
        alt="Food background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl bg-white/80 p-10 shadow-2xl backdrop-blur-md">
          {/* hader */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Utensils className="h-4 w-4" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900">
              NutriLog
            </span>
          </div>

          {/* form */}
          <Form
            action={login}
            className={cn("flex flex-col gap-6", className)}
            {...props}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Login to your account
              </h1>
              <p className="text-sm text-gray-600">
                Enter your email below to login to your account
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm text-gray-600 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* btn */}
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full bg-white/90 text-gray-900 shadow-lg hover:bg-white"
              >
                Log in
              </Button>

            <div className="relative text-center text-sm text-gray-600 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-300">
                <span className="relative z-10 px-2 bg-transparent">
                    Or continue with
                </span>
            </div>

              {/* google btn */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full rounded-full bg-white/80 hover:bg-white"
                onClick={() => signInWithGoogle()}
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
                Login with Google
              </Button>
            </div>

            <div className="text-center text-sm text-gray-700">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium underline underline-offset-4 hover:text-gray-900"
              >
                Sign up
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
