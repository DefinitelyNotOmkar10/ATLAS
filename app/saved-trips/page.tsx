"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtlasLogo } from "@/components/ui/AtlasLogo";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/lib/client";
import { getDestinationHeroImage } from "@/lib/utils/destinationImages";
import { ArrowLeft, ArrowRight, Bookmark, Calendar, Trash2, Sparkles, Loader2, MapPin } from "lucide-react";

interface SavedTrip {
  id: string;
  departure: string;
  destination: string;
  start_date: string;
  end_date: string;
  itinerary_data: object;
  onboarding_data: object;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDays(start: string, end: string) {
  const diff = Math.abs(new Date(end).getTime() - new Date(start).getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function SavedTripsPage() {
  const { user, username, loading, signOut } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const initials = username ? username.slice(0, 2).toUpperCase() : "?";

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?next=/saved-trips");
    }
  }, [user, loading, router]);

  // Fetch trips from Supabase
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("saved_trips")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setTrips(data as SavedTrip[]);
        setTripsLoading(false);
      });
  }, [user]);

  async function handleViewTrip(trip: SavedTrip) {
    localStorage.setItem("planify_onboarding", JSON.stringify(trip.onboarding_data));
    localStorage.setItem("planify_itinerary", JSON.stringify(trip.itinerary_data));
    router.push("/planner");
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from("saved_trips").delete().eq("id", id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
    setDeletingId(null);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-xs font-black uppercase tracking-wider text-black/60">
            Authenticating...
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-blue-600 selection:text-white pb-20">
      {/* ── STICKY TOP HEADER WITH PROMINENT BACK TO HOME BUTTON ── */}
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.03] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>

            <Link href="/" className="hidden sm:flex items-center">
              <AtlasLogo size="sm" showSubtitle={false} />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                {initials}
              </span>
              <span className="text-xs font-bold text-black">{username}</span>
            </div>
            <button
              id="saved-trips-sign-out"
              onClick={handleSignOut}
              className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto pt-10 px-4 sm:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3 bg-blue-50/50">
            <Bookmark className="w-3 h-3" />
            <span>Personal Vault</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase leading-[0.92] tracking-tight text-black">
            SAVED <span className="text-blue-600">EXPEDITIONS.</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60">
            All your generated itineraries and custom routes saved to your account.
          </p>
        </div>

        {tripsLoading && (
          <div className="flex items-center gap-3 text-black/50 py-12">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-xs font-black uppercase tracking-wider">Loading saved trips...</span>
          </div>
        )}

        {!tripsLoading && trips.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => {
              const days = getDays(trip.start_date, trip.end_date);
              const tripImage = getDestinationHeroImage(trip.destination);
              return (
                <article
                  key={trip.id}
                  className="rounded-3xl border border-black/10 bg-white shadow-sm hover:shadow-xl hover:border-black/25 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Destination Photo Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-black/5">
                    <img
                      src={tripImage}
                      alt={trip.destination}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        {trip.departure}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                        {days} Days
                      </span>
                    </div>

                    {/* Bottom City Name */}
                    <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
                      <h2 className="text-2xl font-black uppercase tracking-tight truncate drop-shadow-md">
                        {trip.destination}
                      </h2>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-black/70">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
                    </div>

                    <p className="text-[10px] font-bold text-black/40">
                      Saved {formatDate(trip.created_at)}
                    </p>

                    <div className="pt-3 border-t border-black/10 flex items-center gap-2">
                      <button
                        onClick={() => handleViewTrip(trip)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-black text-white font-black text-xs uppercase tracking-wider transition hover:bg-blue-600 shadow-md"
                      >
                        <span>Open Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        disabled={deletingId === trip.id}
                        className="h-10 w-10 shrink-0 rounded-full border border-black/10 flex items-center justify-center text-black/40 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete trip"
                      >
                        {deletingId === trip.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!tripsLoading && trips.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-black/10 bg-white p-12 text-center shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Bookmark className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black uppercase text-black">No Trips Saved Yet</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-black/50 max-w-sm">
              Generate an itinerary through our onboarding workflow and it will be stored here.
            </p>
            <div className="mt-6">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-md"
              >
                <span>Plan A Trip Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
