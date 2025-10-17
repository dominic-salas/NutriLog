import React from "react";

type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const base =
    "w-full md:w-auto rounded-2xl px-6 py-3 md:px-8 md:py-4 " +
    "font-medium tracking-wide " +
    "backdrop-blur-md border transition-all duration-200 ease-out " +
    "shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:translate-y-[1px] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50";

  const variants = {
    primary:
      "text-white bg-white/10 border-white/25 hover:bg-white/15 hover:border-white/40",
    secondary:
      "text-white bg-white/8 border-white/20 hover:bg-white/12 hover:border-white/35",
  } as const;

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
