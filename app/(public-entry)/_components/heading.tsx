"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Heading = () => {
  return (
    <div className="max-w-5xl space-y-4">
      <h1 className="text-3xl sm:text-3xl md:text-6xl font-bold">
        Your Ideas 💡, Documents 📕, & Plans 🚀. Welcome to <span className="underline">Neuro</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Neuro is the connected workspace where <br /> better, faster work happens.
      </h3>
      <Button>
        Get Neuro free
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default Heading;
