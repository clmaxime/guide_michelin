import { useState, useRef, useEffect } from "react";
import { UserCircle, User, LogOut, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate("/");
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-[2.1rem] w-[2.1rem] items-center justify-center rounded-full bg-black/80 text-white transition hover:bg-black"
        aria-label="Menu utilisateur"
        aria-expanded={open}
      >
        <UserCircle className="size-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-white py-1 shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              {user?.prenom} {user?.nom}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>

          <Link
            to="/favorites"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition hover:bg-accent"
          >
            <Heart className="size-4 text-muted-foreground" />
            Mes favoris
          </Link>

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition hover:bg-accent"
          >
            <User className="size-4 text-muted-foreground" />
            Mon profil
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition hover:bg-accent"
          >
            <LogOut className="size-4 text-muted-foreground" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
