"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/client";
import { AtlasLogo } from "@/components/ui/AtlasLogo";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";

type AuthMode = "sign-in" | "sign-up";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get("next");
  const redirectTo = requestedRedirect?.startsWith("/") ? requestedRedirect : "/onboarding";
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (isMounted) {
        setCurrentEmail(data.user?.email ?? null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentEmail(session?.user?.email ?? null);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both an email and password.");
      return;
    }

    if (mode === "sign-up" && !username.trim()) {
      setErrorMessage("Please enter a username.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        router.push(redirectTo);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      setStatusMessage("Account created! Sign in with your credentials below.");
      setMode("sign-in");
      setPassword("");
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setErrorMessage("");
    setStatusMessage("");

    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setCurrentEmail(null);
    setStatusMessage("You have been signed out.");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-blue-600 selection:text-white flex flex-col justify-between p-6">
      {/* Top Header */}
      <header className="mx-auto w-full max-w-5xl flex items-center justify-between py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>

        <Link href="/">
          <AtlasLogo size="sm" showSubtitle={false} />
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="mx-auto w-full max-w-md my-auto py-8">
        <div className="rounded-3xl border border-black/10 bg-white p-8 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1 bg-blue-50/50">
              <Sparkles className="w-3 h-3" />
              <span>Identity & Session</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">
              {currentEmail ? "Active Session" : mode === "sign-in" ? "Account Sign In" : "Create Account"}
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-black/50">
              {currentEmail
                ? `Signed in as ${currentEmail}`
                : "Sync your saved itineraries across all devices."}
            </p>
          </div>

          {statusMessage && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-xs font-bold text-blue-700">
              {statusMessage}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
              {errorMessage}
            </div>
          )}

          {currentEmail ? (
            <div className="flex flex-col gap-3">
              <Link
                href={redirectTo}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-blue-600 text-white font-black text-xs uppercase tracking-widest transition hover:bg-black shadow-md"
              >
                <span>Continue to App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-full border border-black/15 text-black font-black text-xs uppercase tracking-widest hover:bg-black/5 transition"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "sign-up" && (
                <div className="space-y-1.5">
                  <label htmlFor="username" className="block text-[10px] font-black uppercase tracking-widest text-black/60">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-xs font-bold text-black placeholder:text-black/30 focus:border-blue-600 focus:outline-none"
                    required={mode === "sign-up"}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-black/60">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-xs font-bold text-black placeholder:text-black/30 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-black/60">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-xs font-bold text-black placeholder:text-black/30 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-black text-white font-black text-xs uppercase tracking-widest transition hover:bg-blue-600 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>{mode === "sign-in" ? "Sign In" : "Create Account"}</span>
                )}
              </button>

              <button
                type="button"
                className="w-full py-2 text-center text-xs font-black uppercase tracking-wider text-black/60 hover:text-blue-600 transition"
                onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
              >
                {mode === "sign-in"
                  ? "Don't have an account? Sign up"
                  : "Already registered? Sign in"}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="text-center text-[10px] font-bold uppercase tracking-widest text-black/40 py-4">
        ATLAS AI Travel Platform • All rights reserved
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
