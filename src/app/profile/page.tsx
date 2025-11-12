import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/profileForm';
import MealHistory from '@/components/mealHistory';
import ScanMeal from '@/components/scanMeal';
import Image from 'next/image';
import { LogoutButton } from '@/components/logoutButton';
import { SupportButton } from '@/components/supportButton';

type FormProfile = { id: string; first_name: string; last_name: string; email: string }

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let profile: FormProfile | null = null;
  let errorMsg: string | null = null;

  try {
    const { data: existing, error: selErr } = await supabase
      .from('profiles')
      .select('id, user_id, first_name, last_name, email')
      .eq('user_id', user.id)
      .maybeSingle()

  if (selErr && selErr.code !== 'PGRST116') {
      errorMsg = "Couldn’t load your profile.";
    }

    let row = existing
    if (!row && !errorMsg) {
      const { data: created, error: insErr } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          first_name: '',
          last_name: '',
          email: user.email ?? '',
        })
      .select('id, user_id, first_name, last_name, email')
      .single()

      if (insErr) {
        errorMsg = "Couldn’t create your profile.";
      } else {
        row = created;
      }
    }

    if (row) {
      profile = {
        id: String(row.id),
        first_name: row.first_name ?? '',
        last_name: row.last_name ?? '',
        email: row.email ?? user.email ?? '',
      };
    }
  } catch {
    errorMsg = "Unexpected error loading profile.";
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/food.jpg"
        alt="Food background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      <header className="relative z-20">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <SupportButton userId={user.id} />
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="relative z-10">
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-2 sm:px-6 lg:px-8">
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/15 p-3 text-sm text-red-100">
              {errorMsg}
            </div>
          )}

          {/* Mobile view*/}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5 lg:gap-8">
            <section className="order-2 flex flex-col gap-6 md:order-1 md:col-span-3">
              <ScanMeal />
              <MealHistory userId={user.id} />
            </section>

            <aside className="order-1 w-full md:order-2 md:col-span-2">
              <div className="w-full [&>*]:w-full [&>*]:max-w-none">
                {profile ? (
                  <ProfileForm profile={profile} />
                ) : (
                  <div className="relative w-full rounded-3xl border border-white/15 bg-white/10 p-8 text-white backdrop-blur-2xl">
                    <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/25 via-transparent to-white/10 opacity-60" />
                    <div className="relative space-y-4">
                      <div className="h-6 w-40 rounded bg-white/20" />
                      <div className="h-11 w-full rounded-xl border border-white/15 bg-white/10" />
                      <div className="h-11 w-full rounded-xl border border-white/15 bg-white/10" />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="h-11 w-full rounded-xl border border-white/15 bg-white/10" />
                        <div className="h-11 w-full rounded-xl border border-white/15 bg-white/10" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
