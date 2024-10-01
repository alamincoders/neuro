import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Logo = () => {
  return (
    <div className="items-center gap-x-2 md:flex">
      <Image src="/logo.svg" height="40" width="40" alt="logo" className="dark:hidden rotate-90" />
      <Image src="/logo-dark.svg" height="40" width="40" alt="logo" className="hidden dark:block rotate-90" />
      <p className={cn("font-semibold", font.className)}>Neuro</p>
    </div>
  );
};

export default Logo;
