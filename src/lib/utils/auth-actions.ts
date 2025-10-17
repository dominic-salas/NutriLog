"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const loginAttempts = new Map<string, number[]>();

export async function login(formData: FormData) 
{
    const supabase = await createClient();
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const email = data.email;
    const now = Date.now();
    const attempts = loginAttempts.get(email) || [];
    const recentAttempts = attempts.filter(t => now - t < 3600000); // last hour

    if (recentAttempts.length >= 5) {
        redirect("/login?error=Too many failed attempts. Please try again in an hour.");
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        recentAttempts.push(now);
        loginAttempts.set(email, recentAttempts);
        redirect("/login?error=Invalid email or password.");
    }

    //successful login
    loginAttempts.delete(email);

    revalidatePath("/", "layout");
    redirect("/profile");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;

    console.log(formData);
    const data = {
        email,
        password,
        options: {
            data: {
                full_name: `${firstName + " " + lastName}`,
                email,
            },
        },
    };
    const { data: signupData, error } = await supabase.auth.signUp(data);

    if (error) {
        console.error('Signup error:', error);
        redirect("/error");
    }

    if (signupData.user) { //for testing on dev
        const supabaseAdmin = await createAdminClient();
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                user_id: signupData.user.id,
                first_name: firstName,
                last_name: lastName,
                email,
            });

        if (profileError) {
            console.error('Profile creation failed:', profileError);
            redirect("/error");
        }
    }

    revalidatePath("/", "layout");
    redirect("/profile");
}

export async function signout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log(error);
        redirect("/error");
    }

    redirect("/");
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
        console.log(error);
        redirect("/error");
    }
    redirect(data.url);
}
