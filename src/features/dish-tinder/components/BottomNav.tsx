import { Clock3, Heart, Settings2, UtensilsCrossed } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { href: "/discover", label: "Découvrir", icon: UtensilsCrossed },
  { href: "/favorites", label: "Favoris", icon: Heart },
  { href: "/history", label: "Historique", icon: Clock3 },
  { href: "/settings", label: "Paramètres", icon: Settings2 },
];

function BottomNav() {
  const location = useLocation();
  return (
    <nav className="grid grid-cols-4 border-t border-white/10 bg-[#0f1420]/95 px-1 py-2 backdrop-blur-md">
      {items.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.href;
        return (
          <Link
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-1 py-1 text-[11px] transition duration-200",
              active ? "text-[#ff4458]" : "text-white/65 hover:bg-white/5 hover:text-white",
            )}
            key={item.href}
            to={item.href}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
