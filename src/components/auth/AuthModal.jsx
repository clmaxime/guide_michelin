import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";

export function AuthModal({ onClose }) {
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ prenom: "", nom: "", email: "", password: "" });

  function switchTab(t) {
    setTab(t);
    setError("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      onClose();
    } catch (err) {
      const msg = Array.isArray(err?.message) ? err.message[0] : err?.message;
      setError(msg || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(registerForm);
      await login(registerForm.email, registerForm.password);
      onClose();
    } catch (err) {
      const msg = Array.isArray(err?.message) ? err.message[0] : err?.message;
      setError(msg || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="size-5" />
        </button>

        <p className="font-title mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Guide Michelin
        </p>
        <h2 className="font-title mb-6 text-2xl font-semibold text-foreground">
          {tab === "login" ? "Se connecter" : "Créer un compte"}
        </h2>

        <div className="mb-6 flex gap-6 border-b border-border">
          <button
            onClick={() => switchTab("login")}
            className={`pb-2.5 text-sm font-medium transition-colors ${
              tab === "login"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => switchTab("register")}
            className={`pb-2.5 text-sm font-medium transition-colors ${
              tab === "register"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            S'inscrire
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="jean.dupont@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-2 w-full rounded-full">
              {loading ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Prénom</label>
                <Input
                  placeholder="Jean"
                  value={registerForm.prenom}
                  onChange={(e) => setRegisterForm({ ...registerForm, prenom: e.target.value })}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Nom</label>
                <Input
                  placeholder="Dupont"
                  value={registerForm.nom}
                  onChange={(e) => setRegisterForm({ ...registerForm, nom: e.target.value })}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="jean.dupont@example.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Mot de passe</label>
              <Input
                type="password"
                placeholder="Minimum 6 caractères"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-2 w-full rounded-full">
              {loading ? "Inscription…" : "S'inscrire"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
