import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "blanco" | "negro" | "imagotipo";
type LogoSize    = "xs" | "sm" | "md" | "lg" | "xl";

interface LogoProps {
  variant?:   LogoVariant;
  size?:      LogoSize;
  href?:      string;
  className?: string;
  priority?:  boolean;
}

const SIZES: Record<LogoSize, { w: number; h: number; tailwind: string }> = {
  xs: { w: 100, h: 30,  tailwind: "h-8"  },
  sm: { w: 130, h: 40,  tailwind: "h-10" },
  md: { w: 160, h: 48,  tailwind: "h-12" },
  lg: { w: 200, h: 60,  tailwind: "h-14" },
  xl: { w: 250, h: 75,  tailwind: "h-20" },
};

const SRCS: Record<LogoVariant, string> = {
  color:     "/brand/logo-horizontal-color.png",
  blanco:    "/brand/logo-horizontal-blanco.png",
  negro:     "/brand/logo-horizontal-negro.png",
  imagotipo: "/brand/imagotipo-color.png",
};

const ALT = "Holizenter — El Poder de tu Bienestar";

export default function Logo({
  variant  = "color",
  size     = "md",
  href     = "/",
  className,
  priority = false,
}: LogoProps) {
  const cfg = SIZES[size];

  const img = (
    <Image
      src={SRCS[variant]}
      alt={ALT}
      width={cfg.w}
      height={cfg.h}
      className={cn(cfg.tailwind, "w-auto object-contain", className)}
      priority={priority}
    />
  );

  if (!href) return img;
  return <Link href={href}>{img}</Link>;
}
