"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

export default function ScanMeal() {
  return (
    <div className="relative w-full max-w-4xl rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/25 via-transparent to-white/10 opacity-60" />
      <div className="relative z-10">
        <Link href="/scan" className="block">
          <Button className="h-11 w-full rounded-xl border-0 bg-gradient-to-r from-lime-400/85 to-emerald-500/85 font-semibold text-black hover:from-lime-400 hover:to-emerald-500">
            <Camera className="mr-2 h-5 w-5" />
            Scan Meal
          </Button>
        </Link>
      </div>
    </div>
  );
}