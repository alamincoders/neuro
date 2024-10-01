import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Logo = () => {
  return (
    <Link href="/" className="items-center gap-x-2 md:flex cursor-pointer">
      <Image src="/logo.svg" height="40" width="40" alt="logo" className="dark:hidden rotate-90" />
      <Image src="/logo-dark.svg" height="40" width="40" alt="logo" className="hidden dark:block rotate-90" />
      <p className={cn("font-semibold hidden md:block", font.className)}>Neuro</p>
    </Link>
  );
};

export default Logo;
