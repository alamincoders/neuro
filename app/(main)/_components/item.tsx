import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import React from "react";

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
