import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import HeaderSection from "@/sections/HeaderSection";
import { useUiStore } from "@/store/ui-store";

function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const setScrolled = useUiStore((s) => s.setScrolled);

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-background pt-[4.4rem]">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <p className="font-title mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Guide Michelin
          </p>
          <h1 className="font-title mb-8 text-3xl font-semibold text-foreground">Mon profil</h1>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="font-title text-2xl font-semibold">
                  {user.prenom?.[0]}{user.nom?.[0]}
                </span>
              </div>
              <div>
                <p className="font-title text-xl font-semibold text-foreground">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="divide-y divide-border">
              <InfoRow label="Prénom" value={user.prenom} />
              <InfoRow label="Nom" value={user.nom} />
              <InfoRow label="Email" value={user.email} />
              {user.phoneNumber && <InfoRow label="Téléphone" value={user.phoneNumber} />}
              {user.aboutMe && <InfoRow label="À propos" value={user.aboutMe} />}
              {user.createdAt && (
                <InfoRow
                  label="Membre depuis"
                  value={new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-4 py-3.5">
      <p className="w-32 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export default ProfilePage;
