import { LucideIcon } from "lucide-react";

interface ItemProps {
  onClick: () => void;
  label: string;
  icon: LucideIcon;
}
/**
 * A menu item with an icon, label, and onClick handler.
 *
 * @example
 * <Item onClick={() => {}} label="Example" icon={ChevronRight} />
 *
 * @param {() => void} onClick - The callback to call on click.
 * @param {string} label - The text to display next to the icon.
 * @param {LucideIcon | null | undefined} icon - The icon to display next to the label.
 */
const Item = ({ onClick, label, icon: Icon }: ItemProps) => {
  if (!Icon) {
    throw new Error(
      "Item component requires 'icon' prop to be a valid LucideIcon."
    );
  }

  return (
    <div
      style={{ paddingLeft: "12px" }}
      onClick={(event) => {
        // Stop the event from bubbling up to the parent if the user clicks on the icon
        event.stopPropagation();
        onClick();
      }}
      role="button"
      className="group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium cursor-pointer"
    >
      <Icon className="shrink-0 h-[18px] mr-2 to-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
};
export default Item;
