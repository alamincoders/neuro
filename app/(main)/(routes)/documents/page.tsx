"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const DocumentPage = () => {
  const { user } = useUser();
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image src="/empty.svg" alt="empty" height={300} width={300} className="dark:hidden" />
      <Image src="/empty-dark.svg" alt="empty" height={300} width={300} className="hidden dark:block" />

      <h2 className="text-lg font-medium">Welcome to {user?.firstName}&apos;s workspace - get started by creating a note.</h2>
      <Button className="inline-flex items-center">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentPage;
