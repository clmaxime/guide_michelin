import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeaderSection from "@/sections/HeaderSection";
import FooterSection from "@/sections/FooterSection";
import { useUiStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";

const splitCsv = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const preferences = useAuthStore((state) => state.preferences);
  const loading = useAuthStore((state) => state.loading);
  const savePreferences = useAuthStore((state) => state.savePreferences);
  const navigate = useNavigate();
  const setScrolled = useUiStore((state) => state.setScrolled);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    veganOnly: false,
    excludedIngredients: "",
    allergens: "",
    excludedTags: "",
  });

  useEffect(() => {
    setScrolled(true);
  }, [setScrolled]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setForm({
      veganOnly: Boolean(preferences?.veganOnly),
      excludedIngredients: (preferences?.excludedIngredients ?? []).join(", "),
      allergens: (preferences?.allergens ?? []).join(", "),
      excludedTags: (preferences?.excludedTags ?? []).join(", "),
    });
  }, [preferences]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "-";
    return new Date(user.createdAt).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [user]);

  if (loading || !user) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await savePreferences({
        veganOnly: form.veganOnly,
        excludedIngredients: splitCsv(form.excludedIngredients),
        allergens: splitCsv(form.allergens),
        excludedTags: splitCsv(form.excludedTags),
      });
      setMessage("Préférences enregistrées.");
    } catch {
      setMessage("Impossible d'enregistrer les préférences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <HeaderSection />
      <main className="min-h-screen bg-[#0f0f0f] pt-[4.4rem]">
        <section className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
          <p className="mb-1 font-title text-xs font-semibold uppercase tracking-widest text-primary">Guide Michelin</p>
          <h1 className="mb-8 font-title text-3xl font-semibold text-white">Mon profil</h1>

          <div className="mb-6 rounded-2xl border border-white/12 bg-white/[0.06] p-6 shadow-sm backdrop-blur-md">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                <span className="font-title text-2xl font-semibold">
                  {user.prenom?.[0]}
                  {user.nom?.[0]}
                </span>
              </div>
              <div>
                <p className="font-title text-xl font-semibold text-white">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-sm text-white/60">{user.email}</p>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              <InfoRow label="Prénom" value={user.prenom} />
              <InfoRow label="Nom" value={user.nom} />
              <InfoRow label="Email" value={user.email} />
              {user.phoneNumber && <InfoRow label="Téléphone" value={user.phoneNumber} />}
              {user.aboutMe && <InfoRow label="À propos" value={user.aboutMe} />}
              <InfoRow label="Membre depuis" value={memberSince} />
            </div>
          </div>

          <form className="rounded-2xl border border-white/12 bg-white/[0.06] p-6 shadow-sm backdrop-blur-md" onSubmit={handleSubmit}>
            <h2 className="mb-1 font-title text-2xl text-white">Préférences alimentaires</h2>
            <p className="mb-5 text-sm text-white/60">
              Ces paramètres sont enregistrés sur ton compte et utilisés automatiquement dans le mode Tinder.
            </p>

            <label className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
              <input
                checked={form.veganOnly}
                className="h-4 w-4 accent-primary"
                onChange={(event) => setForm((prev) => ({ ...prev, veganOnly: event.target.checked }))}
                type="checkbox"
              />
              Proposer uniquement des plats vegan
            </label>

            <Field
              hint="Ex: porc, champignon, coriandre"
              label="Aliments refusés"
              value={form.excludedIngredients}
              onChange={(value) => setForm((prev) => ({ ...prev, excludedIngredients: value }))}
            />
            <Field
              hint="Ex: gluten, arachides, crustacés"
              label="Allergènes à exclure"
              value={form.allergens}
              onChange={(value) => setForm((prev) => ({ ...prev, allergens: value }))}
            />
            <Field
              hint="Ex: spicy, seafood"
              label="Tags à exclure"
              value={form.excludedTags}
              onChange={(value) => setForm((prev) => ({ ...prev, excludedTags: value }))}
            />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button className="rounded-full" disabled={saving} type="submit">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              {message ? <p className="text-sm text-white/65">{message}</p> : null}
            </div>
          </form>
        </section>
      </main>
      <FooterSection />
    </>
  );
}

function Field({ label, hint, value, onChange }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-white">{label}</span>
      <input
        className="h-10 w-full rounded-md border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-primary/40"
        onChange={(event) => onChange(event.target.value)}
        placeholder={hint}
        type="text"
        value={value}
      />
      <span className="mt-1 block text-xs text-white/45">Séparer les valeurs par des virgules.</span>
    </label>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-4 py-3.5">
      <p className="w-32 shrink-0 text-xs font-medium uppercase tracking-wider text-white/45">{label}</p>
      <p className="text-sm text-white/90">{value}</p>
    </div>
  );
}

export default ProfilePage;
