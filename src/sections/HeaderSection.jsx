import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";

function HeaderSection() {
  const scrolled = useUiStore((state) => state.scrolled);
  const user = useAuthStore((s) => s.user);
  const [showAuth, setShowAuth] = useState(false);

  const navLinks = [
    { label: "Restaurants", to: "/restaurants" },
    { label: "Hôtels", to: "/hotels" },
    { label: "Inspiration", to: "/discover" },
    { label: "Destinations", to: "/" },
  ];

  const textColor = "text-white";

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-20 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#0b0b0d]/92 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex min-h-[4.4rem] w-full max-w-[1220px] items-center justify-between gap-4 px-4 md:px-7">
          <Link className={`font-title text-xl font-semibold ${textColor}`} to="/">
            Guide Michelin
          </Link>

          <nav aria-label="Navigation principale" className="hidden gap-5 md:flex">
            {navLinks.map((item) => (
              <Link
                className={`text-[0.95rem] font-semibold ${textColor} transition-opacity hover:opacity-80`}
                key={item.label}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                aria-label="Favoris"
                className="inline-flex h-[2.1rem] w-[2.1rem] items-center justify-center rounded-full bg-black/80 p-0 text-white"
                to="/favorites"
              >
                <Heart className="size-4" />
              </Link>
            ) : (
              <Button
                aria-label="Favoris"
                className="h-[2.1rem] w-[2.1rem] rounded-full bg-black/80 p-0 text-white"
                onClick={() => setShowAuth(true)}
                size="icon"
                type="button"
              >
                <Heart className="size-4" />
              </Button>
            )}

            {user ? (
              <UserMenu />
            ) : (
              <>
                <button
                  className={`text-[0.82rem] font-semibold ${textColor} transition-opacity hover:opacity-80`}
                  onClick={() => setShowAuth(true)}
                  type="button"
                >
                  Se connecter
                </button>
                <Link
                  className={buttonVariants({ className: "rounded-full px-4 py-1.5 text-[0.82rem]" })}
                  to="/discover"
                >
                  Découvrir
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default HeaderSection;
