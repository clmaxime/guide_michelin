import { ChefHat, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDishTinderStore } from "../store/dish-tinder-store";

const navItems = [
  { id: "discover", label: "Decouvrir", href: "/discover", icon: ChefHat },
  { id: "favorites", label: "Favoris", href: "/favorites", icon: Heart },
  { id: "profile", label: "Profil", href: "/profile", icon: User },
];

function BottomNav() {
  const location = useLocation();
  const setActiveTab = useDishTinderStore((state) => state.setActiveTab);

  return (
    <nav className="grid grid-cols-3 border-t border-white/10 bg-[#11151e]/95 px-2 py-2 backdrop-blur-md">
      {navItems.map((item) => {
        const active = location.pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs text-white/60 transition duration-300",
              active ? "text-[#ff4458]" : "hover:bg-white/5 hover:text-white",
            )}
            key={item.id}
            onClick={() => setActiveTab(item.id)}
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
