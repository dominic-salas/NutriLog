"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const loginAttempts = new Map<string, number[]>();

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const now = Date.now();
  const attempts = loginAttempts.get(email) || [];
  const recent = attempts.filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= 5) {
    redirect("/login?error=" + encodeURIComponent("Too many failed attempts. Try again in an hour."));
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    recent.push(now);
    loginAttempts.set(email, recent);
    redirect("/login?error=" + encodeURIComponent("Invalid email or password."));
  }

  loginAttempts.delete(email);
  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("first-name") ?? "");
  const lastName = String(formData.get("last-name") ?? "");

  const { data: signupData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`.trim(),
        email,
      },
    },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  if (signupData?.user) {
    try {
      const supabaseAdmin = await createAdminClient();
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          user_id: signupData.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
        });
      if (profileError) {
        return redirect("/login?signup=success&note=profile_pending");
      }
    } catch {
      return redirect("/login?signup=success&note=profile_pending");
    }
  }

  revalidatePath("/", "layout");
  redirect("/login?signup=success");
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }
  redirect("/login");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  redirect(String(data?.url ?? "/login"));
}
