import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() 
{
  return (
    <main className="relative min-h-screen">
      {/* Background */}
      <Image
        src="/food.jpg"
        alt="Fresh food background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="max-w-2xl text-center text-white">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
            NutriLog
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed opacity-90">
            Snap a photo of your meal to instantly track calories, macros, and
            nutritional data. Your personal food log, simplified and visualized.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="w-56 border-white/30 text-white bg-white/10 hover:bg-white/20">
                Create an account
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-56 border-white/30 text-white bg-white/10 hover:bg-white/20">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
