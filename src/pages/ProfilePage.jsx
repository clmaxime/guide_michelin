import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeaderSection from "@/sections/HeaderSection";
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
      <main className="min-h-screen bg-background pt-[4.4rem]">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
          <p className="mb-1 font-title text-xs font-semibold uppercase tracking-widest text-primary">Guide Michelin</p>
          <h1 className="mb-8 font-title text-3xl font-semibold text-foreground">Mon profil</h1>

          <div className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="font-title text-2xl font-semibold">
                  {user.prenom?.[0]}
                  {user.nom?.[0]}
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
              <InfoRow label="Membre depuis" value={memberSince} />
            </div>
          </div>

          <form className="rounded-2xl border border-border bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
            <h2 className="mb-1 font-title text-2xl text-foreground">Préférences alimentaires</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Ces paramètres sont enregistrés sur ton compte et utilisés automatiquement dans le mode Tinder.
            </p>

            <label className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
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
              <Button disabled={saving} type="submit">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

function Field({ label, hint, value, onChange }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
        onChange={(event) => onChange(event.target.value)}
        placeholder={hint}
        type="text"
        value={value}
      />
      <span className="mt-1 block text-xs text-muted-foreground">Séparer les valeurs par des virgules.</span>
    </label>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-4 py-3.5">
      <p className="w-32 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export default ProfilePage;
