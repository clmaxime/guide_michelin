import BottomNav from "./BottomNav";

function PhoneShell({ title, children }) {
  return (
    <section className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden border-x border-white/10 bg-[#090c12] text-white shadow-2xl shadow-black/40">
      <header className="sticky top-0 z-20 flex items-center justify-center border-b border-white/10 bg-[#090c12]/92 px-4 py-4 backdrop-blur-md">
        <h1 className="text-base font-semibold">{title}</h1>
      </header>
      <div className="flex-1 overflow-auto">{children}</div>
      <BottomNav />
    </section>
  );
}

export default PhoneShell;
