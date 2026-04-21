import type { ReactNode } from "react";
import BottomNav from "./BottomNav";

type PhoneShellProps = {
  title: string;
  rightSlot?: ReactNode;
  children: ReactNode;
};

function PhoneShell({ title, rightSlot, children }: PhoneShellProps) {
  return (
    <section className="relative mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden border-x border-white/10 bg-[#090d15] text-white shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#090d15]/92 px-4 py-4 backdrop-blur-md">
        <p className="text-sm font-medium text-white/70">LE GUIDE MICHELIN</p>
        <h1 className="text-base font-semibold">{title}</h1>
        <div className="min-w-16 text-right">{rightSlot}</div>
      </header>
      <div className="flex-1 overflow-auto">{children}</div>
      <BottomNav />
    </section>
  );
}

export default PhoneShell;
