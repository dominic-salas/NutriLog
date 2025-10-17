import Image from "next/image";
import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <Image
        src="/food.jpg"
        alt="Fresh food background"
        fill
        priority
        className="object-cover"
      />

      {/* Deep charcoal overlay */}
      <div className="absolute inset-0 bg-[#0c0f0c]/80" />

      {/* Subtle ambient sage glows */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-lime-200/10 blur-3xl" />
      <div className="pointer-events-none absolute top-28 right-10 h-24 w-24 rounded-full bg-emerald-200/10 blur-xl" />

      {/* Centered glass rectangle */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div
          className="relative flex flex-col items-center justify-center text-center text-white
             w-[85vw] max-w-md rounded-3xl bg-white/5 backdrop-blur-2xl
             border border-white/15 py-14 px-8 shadow-[0_8px_60px_-15px_rgba(0,0,0,0.7)] sm:py-16 sm:px-12"
        >
          {/* Subtle inner gloss */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-black/20 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-4">NutriLog</h1>
            <p className="text-base sm:text-lg leading-relaxed text-white/85 mb-8 max-w-sm">
              Snap a photo of your meal to instantly track calories, macros, and
              nutritional data. Your personal food log, simplified and visualized.
            </p>

            {/* Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <div className="w-4/5 sm:w-3/4 max-w-sm mx-auto flex flex-col gap-4">
                {/* Sign up — glass outline */}
                <Link href="/signup">
                  <GlassButton
                    className="w-4/5 sm:w-3/4 max-w-sm mx-auto rounded-lg px-8 text-base font-medium
                       bg-white/10 border border-white/25
                       hover:bg-white/15 hover:border-white/40
                       shadow-[0_4px_15px_rgba(0,0,0,0.25)]"
                  >
                    Sign up
                  </GlassButton>
                </Link>

                {/* Log in — gradient fill */}
                <Link href="/login">
                  <GlassButton
                    variant="secondary"
                    className="w-4/5 sm:w-3/4 max-w-sm mx-auto rounded-lg px-8 text-base font-medium
                       bg-gradient-to-r from-emerald-300/80 to-lime-400/80
                       hover:from-emerald-300 hover:to-lime-400
                       border-0 shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
                  >
                    Log in
                  </GlassButton>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
