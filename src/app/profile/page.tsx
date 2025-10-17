import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/profileForm';
import MealHistory from '@/components/mealHistory';
import ScanMeal from '@/components/scanMeal';
import Image from 'next/image';
import { LogoutButton } from '@/components/logoutButton';

type FormProfile = { id: string; first_name: string; last_name: string; email: string }

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existing, error: selErr } = await supabase
    .from('profiles')
    .select('id, user_id, first_name, last_name, email')
    .eq('user_id', user.id)
    .maybeSingle()

  if (selErr && selErr.code !== 'PGRST116') {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="rounded-xl bg-white/90 p-6 text-gray-900 shadow">
          Couldn’t load your profile (check RLS on <code>profiles</code>).
        </div>
      </div>
    )
  }

  let row = existing
  if (!row) {
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
      return (
        <div className="min-h-screen grid place-items-center">
          <div className="rounded-xl bg-white/90 p-6 text-gray-900 shadow">
            Couldn’t create your profile (check <code>insert</code> RLS).
          </div>
        </div>
      )
    }
    row = created
  }

  const profile: FormProfile = {
    id: String(row.id),
    first_name: row.first_name ?? '',
    last_name: row.last_name ?? '',
    email: row.email ?? user.email ?? '',
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

      <div className="absolute top-4 right-4 z-10">
        <LogoutButton />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 gap-8">
        <div className="flex flex-col gap-8">
          <ScanMeal />
          <MealHistory userId={user.id} />
        </div>
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}