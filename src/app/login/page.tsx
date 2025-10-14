import { UtensilsCrossed } from "lucide-react";
import { LoginForm } from "@/components/loginForm";

export default function LoginPage() 
{
  return (
    <>
      <div className="absolute left-0 top-0 z-50 flex items-center gap-2 p-4 text-white">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <UtensilsCrossed className="size-4" />
        </div>
        <span className="font-medium">NutriLog</span>
      </div>

      <LoginForm />
    </>
  );
}

