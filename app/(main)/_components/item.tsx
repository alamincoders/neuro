import { LucideIcon } from "lucide-react";

interface ItemProps {
  onClick: () => void;
  label: string;
  icon: LucideIcon;
}
const Item = ({ onClick, label, icon: Icon }: ItemProps) => {
  return (
    <div
      style={{ paddingLeft: "12px" }}
      onClick={onClick}
      role="button"
      className="group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium cursor-pointer"
    >
      <Icon className="shrink-0 h-[18px] mr-2 to-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
};
export default Item;
