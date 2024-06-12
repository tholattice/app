import { cn } from "@/utils/merge";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      className={cn("h-10 w-10 text-black", className)}
      src="/TholatticeSymbolWhiteBG.png"
      height={150}
      width={150}
      alt="Tholattice Logo"
    />
  );
}
