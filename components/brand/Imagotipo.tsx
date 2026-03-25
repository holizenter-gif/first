import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImagotipoProps {
  size?:      number;
  className?: string;
}

export default function Imagotipo({ size = 48, className }: ImagotipoProps) {
  return (
    <Image
      src="/brand/imagotipo-color.png"
      alt="Holizenter"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}
