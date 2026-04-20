import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useContentStore } from "@/store/content-store";

function FooterSection() {
  const footerSocials = useContentStore((state) => state.footerSocials);

  return (
    <footer className="bg-[#111] py-11 text-white">
      <div className="mx-auto grid w-full max-w-[1220px] gap-5 px-4 md:px-7 xl:grid-cols-[1.2fr_1.5fr_auto] xl:items-center">
        <div>
          <p className="font-title mb-1.5 text-[1.6rem] text-[#ff5c73]">Le Guide Michelin</p>
          <p>Adresses d'exception, destinations et experiences.</p>
        </div>
        <Separator className="xl:hidden" />
        <form className="grid gap-3">
          <label className="text-[0.92rem]" htmlFor="email">
            Recevez nos inspirations exclusives
          </label>
          <div className="flex gap-2">
            <Input
              className="min-h-10 rounded-[0.65rem] border-white/35 bg-transparent text-white placeholder:text-white/70"
              id="email"
              placeholder="Votre email"
              type="email"
            />
            <Button className="min-w-28 rounded-[0.65rem] px-3 font-bold" type="button">
              S'inscrire
            </Button>
          </div>
        </form>
        <Separator className="xl:hidden" />
        <ul className="flex gap-3.5">
          {footerSocials.map((social) => (
            <li key={social}>
              <a className="inline-block rounded-full border border-white/25 px-3 py-1.5 text-[0.85rem] font-semibold" href="#top">
                {social}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default FooterSection;
