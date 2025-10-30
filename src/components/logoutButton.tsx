"use client";

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signout } from '@/lib/utils/auth-actions';

export function LogoutButton() {
  const handleLogout = async () => {
    await signout();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/20 backdrop-blur-2xl"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}