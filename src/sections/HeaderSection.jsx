import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useContentStore } from "@/store/content-store";
import { useUiStore } from "@/store/ui-store";

function HeaderSection() {
  const headerLinks = useContentStore((state) => state.headerLinks);
  const scrolled = useUiStore((state) => state.scrolled);

  return (
    <header
      className={`fixed left-0 top-0 z-20 w-full transition-all duration-300 ${
        scrolled ? "bg-background/95 shadow-[0_10px_22px_rgba(17,17,17,0.08)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex min-h-[4.4rem] w-full max-w-[1220px] items-center justify-between gap-4 px-4 md:px-7">
        <Link className={`font-title text-xl font-semibold ${scrolled ? "text-foreground" : "text-white"}`} to="/">
          Guide Michelin
        </Link>
        <nav aria-label="Navigation principale" className="hidden gap-5 md:flex">
          {headerLinks.map((item) => (
            <a
              className={`text-[0.95rem] font-semibold ${scrolled ? "text-foreground" : "text-white"}`}
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button aria-label="Favoris" className="h-[2.1rem] w-[2.1rem] rounded-full bg-black/80 p-0 text-white" size="icon" type="button">
            <Heart className="size-4" />
          </Button>
          <Link className={buttonVariants({ className: "rounded-full px-4 py-1.5 text-[0.82rem]" })} to="/discover">
            Discover
          </Link>
        </div>
      </div>
    </header>
  );
}

export default HeaderSection;
