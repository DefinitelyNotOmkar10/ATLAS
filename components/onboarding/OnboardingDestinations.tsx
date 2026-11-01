"use client";

import { useState, useEffect } from "react";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { DestinationData, LocationDetail } from "@/lib/types/onboarding";
import { useLocationData, filterOptions } from "@/lib/data/locations";
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  PlaneTakeoff, 
  PlaneLanding, 
  Plane, 
  Car, 
  Train, 
  Bus,
  ChevronDown
} from "lucide-react";

export default function OnboardingDestinations() {
  const { data, updateData, nextStep, previousStep } = useOnboarding();
  const [destination, setDestination] = useState<DestinationData>(data.destination);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"from" | "to" | null>(null);

  const {
    countries,
    getStatesByCountry,
    getCitiesByState,
    loading: locationsLoading,
    error: locationsError,
  } = useLocationData();

  const [fromCountrySearch, setFromCountrySearch] = useState("");
  const [fromStateSearch, setFromStateSearch] = useState("");
  const [fromCitySearch, setFromCitySearch] = useState("");
  const [toCountrySearch, setToCountrySearch] = useState("");
  const [toStateSearch, setToStateSearch] = useState("");
  const [toCitySearch, setToCitySearch] = useState("");

  const [showFromCountryDropdown, setShowFromCountryDropdown] = useState(false);
  const [showFromStateDropdown, setShowFromStateDropdown] = useState(false);
  const [showFromCityDropdown, setShowFromCityDropdown] = useState(false);
  const [showToCountryDropdown, setShowToCountryDropdown] = useState(false);
  const [showToStateDropdown, setShowToStateDropdown] = useState(false);
  const [showToCityDropdown, setShowToCityDropdown] = useState(false);
  const [showTransportDropdown, setShowTransportDropdown] = useState(false);

  const fromStates = getStatesByCountry(destination.from.country);
  const fromCities = getCitiesByState(destination.from.country, destination.from.state);
  const toStates = getStatesByCountry(destination.to.country);
  const toCities = getCitiesByState(destination.to.country, destination.to.state);

  const transportModes = [
    { value: "flight", label: "Flight / Air", icon: Plane },
    { value: "car", label: "Car / Road Trip", icon: Car },
    { value: "train", label: "Train / Rail", icon: Train },
    { value: "bus", label: "Bus / Coach", icon: Bus },
  ] as const;

  useEffect(() => {
    setDestination(data.destination);
  }, [data.destination]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".autocomplete-dropdown") && !target.closest("input")) {
        setShowFromCountryDropdown(false);
        setShowFromStateDropdown(false);
        setShowFromCityDropdown(false);
        setShowToCountryDropdown(false);
        setShowToStateDropdown(false);
        setShowToCityDropdown(false);
        setShowTransportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNext = () => {
    if (!destination.from.city.trim() || !destination.from.country.trim()) {
      setError("Please enter your departure location!");
      return;
    }
    if (!destination.to.city.trim() || !destination.to.country.trim()) {
      setError("Please enter your destination!");
      return;
    }
    if (!destination.transport) {
      setError("Please select how you plan to travel!");
      return;
    }

    updateData("destination", destination);
    setError("");
    nextStep();
  };

  const handleLocationChange = (
    type: "from" | "to",
    field: keyof LocationDetail,
    value: string
  ) => {
    setDestination((prev) => {
      const updated = { ...prev[type], [field]: value };
      if (field === "country") {
        updated.state = "";
        updated.city = "";
        if (type === "from") {
          setFromStateSearch("");
          setFromCitySearch("");
        } else {
          setToStateSearch("");
          setToCitySearch("");
        }
      } else if (field === "state") {
        updated.city = "";
        if (type === "from") {
          setFromCitySearch("");
        } else {
          setToCitySearch("");
        }
      }
      return { ...prev, [type]: updated };
    });
    setError("");
  };

  const handleSelectOption = (
    type: "from" | "to",
    field: keyof LocationDetail,
    value: string
  ) => {
    handleLocationChange(type, field, value);
    if (type === "from") {
      if (field === "country") {
        setFromCountrySearch(value);
        setShowFromCountryDropdown(false);
        setShowFromStateDropdown(true);
      } else if (field === "state") {
        setFromStateSearch(value);
        setShowFromStateDropdown(false);
        setShowFromCityDropdown(true);
      } else if (field === "city") {
        setFromCitySearch(value);
        setShowFromCityDropdown(false);
      }
    } else {
      if (field === "country") {
        setToCountrySearch(value);
        setShowToCountryDropdown(false);
        setShowToStateDropdown(true);
      } else if (field === "state") {
        setToStateSearch(value);
        setShowToStateDropdown(false);
        setShowToCityDropdown(true);
      } else if (field === "city") {
        setToCitySearch(value);
        setShowToCityDropdown(false);
      }
    }
  };

  const isLocationComplete = (loc: LocationDetail) => {
    return Boolean(loc.country.trim() && loc.state.trim() && loc.city.trim());
  };

  return (
    <div className="planify-onboarding-step animate-fadeIn space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 bg-blue-50/50">
          <Sparkles className="w-3 h-3" />
          <span>Step 03 / Route</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] text-black">
          WHERE ARE YOU <br />
          <span className="text-blue-600">HEADING?</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60">
          Specify your departure, arrival destination, and transport mode.
        </p>
      </div>

      <div className="space-y-4 max-w-xl">
        {/* ── 1. DEPARTURE (FROM) ── */}
        <div
          className={`rounded-3xl border p-5 transition-all ${
            activeSection === "from"
              ? "border-blue-600 bg-blue-50/20 shadow-md"
              : "border-black/10 bg-white"
          }`}
          onFocus={() => setActiveSection("from")}
          onBlur={() => setActiveSection(null)}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center">
              <PlaneTakeoff className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Starting Point (From)</h3>
              <p className="text-[10px] font-bold text-black/50">
                {isLocationComplete(destination.from)
                  ? `${destination.from.city}, ${destination.from.state}, ${destination.from.country}`
                  : "Where does your journey begin?"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Country */}
            <div className="relative" style={{ zIndex: showFromCountryDropdown ? 50 : 1 }}>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black/60 mb-1">
                Country
              </label>
              <input
                type="text"
                value={destination.from.country || fromCountrySearch}
                onChange={(e) => {
                  setFromCountrySearch(e.target.value);
                  if (destination.from.country) handleLocationChange("from", "country", "");
                }}
                onFocus={() => setShowFromCountryDropdown(true)}
                placeholder="Country..."
                className="w-full px-3 py-2.5 text-xs font-bold border border-black/15 rounded-xl bg-white focus:border-blue-600 focus:outline-none"
              />
              {showFromCountryDropdown && (
                <div className="autocomplete-dropdown absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-xl z-50 p-1">
                  {filterOptions(countries, fromCountrySearch).slice(0, 50).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleSelectOption("from", "country", c)}
                      className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* State */}
            <div className="relative" style={{ zIndex: showFromStateDropdown ? 50 : 1 }}>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black/60 mb-1">
                State / Region
              </label>
              <input
                type="text"
                value={destination.from.state || fromStateSearch}
                onChange={(e) => {
                  setFromStateSearch(e.target.value);
                  if (destination.from.state) handleLocationChange("from", "state", "");
                }}
                onFocus={() => setShowFromStateDropdown(true)}
                disabled={!destination.from.country}
                placeholder="State..."
                className="w-full px-3 py-2.5 text-xs font-bold border border-black/15 rounded-xl bg-white focus:border-blue-600 focus:outline-none disabled:opacity-50"
              />
              {showFromStateDropdown && destination.from.country && (
                <div className="autocomplete-dropdown absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-xl z-50 p-1">
                  {filterOptions(fromStates, fromStateSearch).slice(0, 50).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSelectOption("from", "state", s)}
                      className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City */}
            <div className="relative" style={{ zIndex: showFromCityDropdown ? 50 : 1 }}>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black/60 mb-1">
                City
              </label>
              <input
                type="text"
                value={destination.from.city || fromCitySearch}
                onChange={(e) => {
                  setFromCitySearch(e.target.value);
                  if (destination.from.city) handleLocationChange("from", "city", "");
                }}
                onFocus={() => setShowFromCityDropdown(true)}
                disabled={!destination.from.state}
                placeholder="City..."
                className="w-full px-3 py-2.5 text-xs font-bold border border-black/15 rounded-xl bg-white focus:border-blue-600 focus:outline-none disabled:opacity-50"
              />
              {showFromCityDropdown && destination.from.state && (
                <div className="autocomplete-dropdown absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-xl z-50 p-1">
                  {filterOptions(fromCities, fromCitySearch).slice(0, 50).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelectOption("from", "city", city)}
                      className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. DESTINATION (TO) ── */}
        <div
          className={`rounded-3xl border p-5 transition-all ${
            activeSection === "to"
              ? "border-blue-600 bg-blue-50/20 shadow-md"
              : "border-black/10 bg-white"
          }`}
          onFocus={() => setActiveSection("to")}
          onBlur={() => setActiveSection(null)}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <PlaneLanding className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Destination Point (To)</h3>
              <p className="text-[10px] font-bold text-black/50">
                {isLocationComplete(destination.to)
                  ? `${destination.to.city}, ${destination.to.state}, ${destination.to.country}`
                  : "Where do you want to go?"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Country */}
            <div className="relative" style={{ zIndex: showToCountryDropdown ? 50 : 1 }}>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black/60 mb-1">
                Country
              </label>
              <input
                type="text"
                value={destination.to.country || toCountrySearch}
                onChange={(e) => {
                  setToCountrySearch(e.target.value);
                  if (destination.to.country) handleLocationChange("to", "country", "");
                }}
                onFocus={() => setShowToCountryDropdown(true)}
                placeholder="Country..."
                className="w-full px-3 py-2.5 text-xs font-bold border border-black/15 rounded-xl bg-white focus:border-blue-600 focus:outline-none"
              />
              {showToCountryDropdown && (
                <div className="autocomplete-dropdown absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-xl z-50 p-1">
                  {filterOptions(countries, toCountrySearch).slice(0, 50).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleSelectOption("to", "country", c)}
                      className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* State */}
            <div className="relative" style={{ zIndex: showToStateDropdown ? 50 : 1 }}>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black/60 mb-1">
                State / Region
              </label>
              <input
                type="text"
                value={destination.to.state || toStateSearch}
                onChange={(e) => {
                  setToStateSearch(e.target.value);
                  if (destination.to.state) handleLocationChange("to", "state", "");
                }}
                onFocus={() => setShowToStateDropdown(true)}
                disabled={!destination.to.country}
                placeholder="State..."
                className="w-full px-3 py-2.5 text-xs font-bold border border-black/15 rounded-xl bg-white focus:border-blue-600 focus:outline-none disabled:opacity-50"
              />
              {showToStateDropdown && destination.to.country && (
                <div className="autocomplete-dropdown absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-xl z-50 p-1">
                  {filterOptions(toStates, toStateSearch).slice(0, 50).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSelectOption("to", "state", s)}
                      className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City */}
            <div className="relative" style={{ zIndex: showToCityDropdown ? 50 : 1 }}>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black/60 mb-1">
                City
              </label>
              <input
                type="text"
                value={destination.to.city || toCitySearch}
                onChange={(e) => {
                  setToCitySearch(e.target.value);
                  if (destination.to.city) handleLocationChange("to", "city", "");
                }}
                onFocus={() => setShowToCityDropdown(true)}
                disabled={!destination.to.state}
                placeholder="City..."
                className="w-full px-3 py-2.5 text-xs font-bold border border-black/15 rounded-xl bg-white focus:border-blue-600 focus:outline-none disabled:opacity-50"
              />
              {showToCityDropdown && destination.to.state && (
                <div className="autocomplete-dropdown absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-xl z-50 p-1">
                  {filterOptions(toCities, toCitySearch).slice(0, 50).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelectOption("to", "city", city)}
                      className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. TRANSPORT MODE ── */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-black/60 block">
            Mode of Transit
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {transportModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = destination.transport === mode.value;
              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setDestination((prev) => ({ ...prev, transport: mode.value }))}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20"
                      : "border-black/10 bg-white hover:border-black/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? "text-blue-600" : "text-black/70"}`} />
                  <span className="text-xs font-black uppercase text-black">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Route Preview Badge */}
        {isLocationComplete(destination.from) && isLocationComplete(destination.to) && (
          <div className="p-4 rounded-2xl bg-black text-white flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-white/70">
              Active Route:
            </span>
            <span className="text-xs font-black uppercase text-blue-400">
              {destination.from.city} → {destination.to.city} ({destination.transport})
            </span>
          </div>
        )}

        {error && (
          <p className="text-xs font-bold text-red-500 animate-fadeIn" role="alert">
            {error}
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={previousStep}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-full border border-black/15 bg-white text-black font-black text-xs uppercase tracking-wider transition hover:bg-black/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!isLocationComplete(destination.from) || !isLocationComplete(destination.to) || !destination.transport}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-lg"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
