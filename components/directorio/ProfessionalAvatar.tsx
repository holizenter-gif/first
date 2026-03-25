"use client";

import { useState } from "react";
import Image from "next/image";

interface ProfessionalAvatarProps {
  src:      string | null;
  nombre:   string;
  fill?:    boolean;
  priority?: boolean;
  className?: string;
  sizes?:   string;
}

export default function ProfessionalAvatar({
  src, nombre, fill = false, priority = false, className = "", sizes,
}: ProfessionalAvatarProps) {
  const [error, setError] = useState(false);
  const initials = nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "#EBF8F2" }}>
        <div
          className="rounded-full flex items-center justify-center text-white font-sans font-bold"
          style={{ background: "#5CB996", width: fill ? "80px" : "96px", height: fill ? "80px" : "96px", fontSize: fill ? "28px" : "32px" }}
        >
          {initials}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={nombre}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}
