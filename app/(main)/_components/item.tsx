import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ChevronDown, ChevronRight, LucideIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface ItemProps {
  onClick: () => void;
  label: string;
  icon: LucideIcon;
  // optional
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
}

const Item = ({
  id,
  onExpand,
  expanded,
  active,
  isSearch,
  level = 0,
  documentIcon,
  onClick,
  label,
  icon: Icon,
}: ItemProps) => {
  if (!Icon) {
    throw new Error(
      "Item component requires 'icon' prop to be a valid LucideIcon."
    );
  }

  const create = useMutation(api.documents.create);
  const router = useRouter();

  const onExpandHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined
  ): void => {
    if (!e) {
      console.error("onExpandHandler: e is undefined");
      return;
    }
    e.stopPropagation();
    if (!onExpand) {
      console.error("onExpandHandler: onExpand is undefined");
      return;
    }
    try {
      onExpand();
    } catch (error) {
      console.error("onExpandHandler:", error);
    }
  };

  /**
   * Creates a new document with the given parent document ID, and then
   * redirects the user to the newly created document's page.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e
   *   The event that triggered this function.
   */
  const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Stop the event from bubbling up to the parent if the user clicks on the icon
    e.stopPropagation();

    // If the parent document ID is not provided, do nothing
    if (!id) return;

    // Create a new document with the given parent document ID
    const promise = create({
      parentDocument: id,
      title: "Untitled",
    }).then((documentId) => {
      // If the user clicks on the "New document" button when the parent document
      // is not expanded, expand it first before redirecting the user to the
      // newly created document's page
      if (!expanded) {
        onExpand?.();
      }

      // Redirect the user to the newly created document's page
      router.push(`/documents/${documentId}`);
    });

    // Show a toast notification to the user while the document is being created
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      onClick={(event) => {
        // Stop the event from bubbling up to the parent if the user clicks on the icon
        event.stopPropagation();
        onClick();
      }}
      role="button"
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium cursor-pointer",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
          onClick={onExpandHandler}
        >
          <ChevronIcon className="shrink-0 h-4 w-4 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 text-[18px] mr-2">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 uppercase">
          <span className="text-xs">&#8984;</span> + K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};
export default Item;

Item.Skeleton = function ItemSkeleton({ level }: { level: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
