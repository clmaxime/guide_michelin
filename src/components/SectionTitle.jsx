import { Badge } from "@/components/ui/badge";

function SectionTitle({ eyebrow, title, subtitle, dark = false }) {
  return (
    <header className="mb-6">
      {eyebrow ? (
        <Badge className={`mb-2 rounded-md uppercase tracking-[0.08em] ${dark ? "bg-primary/20 text-primary" : ""}`}>
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className={`font-title text-[1.65rem] leading-[1.15] md:text-[2.15rem] xl:text-[2.55rem] ${dark ? "text-white" : ""}`}>{title}</h2>
      {subtitle ? <p className={`mt-2 max-w-[40rem] ${dark ? "text-white/60" : "text-muted-foreground"}`}>{subtitle}</p> : null}
    </header>
  );
}

export default SectionTitle;
