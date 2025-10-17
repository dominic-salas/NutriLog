import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/profileForm';
import MealHistory from '@/components/mealHistory';
import ScanMeal from '@/components/scanMeal';
import Image from 'next/image';
import { LogoutButton } from '@/components/logoutButton';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (!profile) {
        redirect('/error');
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