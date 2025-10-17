"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

export default function ScanMeal() {
    return (
        <div className="w-full max-w-4xl rounded-3xl bg-white/80 p-10 shadow-2xl backdrop-blur-md">
            <Link href="/scan">
                <Button className="w-full flex items-center justify-center gap-2 w-full text-gray-900 bg-gray-200 hover:bg-gray-300">
                    <Camera className="h-5 w-5" />
                    Scan Meal
                </Button>
            </Link>
        </div>
    );
}