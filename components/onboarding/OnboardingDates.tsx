"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { DatesData } from "@/lib/types/onboarding";
import { ArrowLeft, ArrowRight, Sparkles, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatDisplay(dateStr: string) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface CalendarMonthProps {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  hoverDate: string;
  today: string;
  onDateClick: (key: string) => void;
  onDateHover: (key: string) => void;
}

function CalendarMonth({
  year,
  month,
  startDate,
  endDate,
  hoverDate,
  today,
  onDateClick,
  onDateHover,
}: CalendarMonthProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const rangeEnd = !endDate && hoverDate && startDate && hoverDate >= startDate ? hoverDate : endDate;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-xs font-black uppercase tracking-wider text-black">
        {MONTHS[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-0.5">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="text-center text-[10px] font-black uppercase text-black/40 py-1">
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = toDateKey(year, month, day);
          const isToday = key === today;
          const isStart = key === startDate;
          const isEnd = key === endDate;
          const isPast = key < today;
          const inRange = startDate && rangeEnd && key > startDate && key < rangeEnd;
          const isRangeEnd = key === rangeEnd && rangeEnd !== startDate;

          let cellClass =
            "relative flex items-center justify-center h-8 w-full text-xs font-bold rounded-lg cursor-pointer transition-all duration-150 select-none ";

          if (isPast) {
            cellClass += "text-black/20 cursor-not-allowed ";
          } else if (isStart || isEnd) {
            cellClass += "text-white font-black z-10 bg-blue-600 shadow-sm ";
          } else if (inRange) {
            cellClass += "text-blue-900 bg-blue-50/80 ";
          } else {
            cellClass += "text-black hover:bg-black/5 ";
          }

          return (
            <div
              key={key}
              onClick={() => !isPast && onDateClick(key)}
              onMouseEnter={() => !isPast && onDateHover(key)}
              className="relative"
            >
              {(inRange || isRangeEnd) && (
                <div className="absolute inset-y-0 left-0 right-0 z-0 bg-blue-50" />
              )}
              {isStart && (
                <div className="absolute inset-y-0 left-1/2 right-0 z-0 bg-blue-50" />
              )}
              {isRangeEnd && !isEnd && (
                <div className="absolute inset-y-0 left-0 right-1/2 z-0 bg-blue-50" />
              )}

              <div className={`${cellClass} relative z-10`}>
                {isToday && !isStart && !isEnd && (
                  <div className="absolute inset-0 rounded-lg border border-black/30 z-0" />
                )}
                <span className="relative z-10">{day}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OnboardingDates() {
  const { data, updateData, nextStep, previousStep } = useOnboarding();
  const [dates, setDates] = useState<DatesData>(data.dates);
  const [error, setError] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState("");
  const [selectingEnd, setSelectingEnd] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split("T")[0];
  const nowDate = new Date();
  const [viewYear, setViewYear] = useState(nowDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(nowDate.getMonth());

  useEffect(() => {
    setDates(data.dates);
  }, [data.dates]);

  useEffect(() => {
    if (!calendarOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCalendarOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [calendarOpen]);

  const handleDateClick = useCallback(
    (key: string) => {
      if (!selectingEnd || !dates.startDate || key < dates.startDate) {
        setDates((prev) => ({ ...prev, startDate: key, endDate: "" }));
        setSelectingEnd(true);
      } else {
        setDates((prev) => ({ ...prev, endDate: key }));
        setSelectingEnd(false);
        setHoverDate("");
        setTimeout(() => setCalendarOpen(false), 200);
      }
      setError("");
    },
    [selectingEnd, dates.startDate]
  );

  const handleNext = () => {
    if (!dates.startDate || !dates.endDate) {
      setError("Please select both start and end dates!");
      return;
    }
    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    if (end < start) {
      setError("End date must be after start date!");
      return;
    }
    updateData("dates", dates);
    setError("");
    nextStep();
  };

  const getTripDuration = () => {
    if (!dates.startDate || !dates.endDate) return null;
    const diff = Math.abs(new Date(dates.endDate).getTime() - new Date(dates.startDate).getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const duration = getTripDuration();

  const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);
  const nextMonth = nextMonthDate.getMonth();
  const nextYear = nextMonthDate.getFullYear();

  const prevMonthDisabled =
    viewYear < nowDate.getFullYear() ||
    (viewYear === nowDate.getFullYear() && viewMonth <= nowDate.getMonth());

  function openCalendar() {
    setCalendarOpen(true);
    if (!dates.startDate) setSelectingEnd(false);
    else if (!dates.endDate) setSelectingEnd(true);
    else setSelectingEnd(false);
  }

  const displayLabel = () => {
    if (!dates.startDate) return "Select travel dates";
    if (!dates.endDate) return `${formatDisplay(dates.startDate)} → pick end date`;
    return `${formatDisplay(dates.startDate)} → ${formatDisplay(dates.endDate)}`;
  };

  return (
    <div className="planify-onboarding-step animate-fadeIn space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 bg-blue-50/50">
          <Sparkles className="w-3 h-3" />
          <span>Step 04 / Timeline</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] text-black">
          WHEN ARE YOU <br />
          <span className="text-blue-600">TRAVELING?</span>
        </h2>
        <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black/60">
          Select departure and return dates.
        </p>
      </div>

      <div className="space-y-6 max-w-xl">
        {/* Date Selector Trigger Card */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm space-y-5">
          <span className="text-[11px] font-black uppercase tracking-widest text-black/60 block">
            Trip Duration & Dates
          </span>

          <button
            id="open-calendar-button"
            type="button"
            onClick={openCalendar}
            className={`w-full flex items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
              dates.startDate
                ? "border-blue-600 bg-blue-50/30 text-black shadow-sm"
                : "border-black/15 bg-black/[0.02] text-black/60 hover:border-black/30"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-sm font-black uppercase tracking-wider truncate">
                {displayLabel()}
              </span>
            </div>

            {duration && duration > 0 && (
              <span className="shrink-0 rounded-full px-3 py-1 bg-black text-white text-[11px] font-black uppercase tracking-wider">
                {duration} {duration === 1 ? "day" : "days"}
              </span>
            )}
          </button>

          {/* Flexible Dates Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              id="flexible-dates"
              type="checkbox"
              checked={dates.flexible}
              onChange={(e) => setDates((prev) => ({ ...prev, flexible: e.target.checked }))}
              className="h-4 w-4 rounded border-black/30 text-blue-600 focus:ring-blue-600"
            />
            <label htmlFor="flexible-dates" className="cursor-pointer">
              <span className="text-xs font-black uppercase tracking-wide text-black">
                Dates are flexible (±3 days)
              </span>
            </label>
          </div>
        </div>

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
            disabled={!dates.startDate || !dates.endDate}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-lg"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modern Modal Calendar */}
      {calendarOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCalendarOpen(false);
          }}
        >
          <div
            ref={overlayRef}
            className="relative w-full max-w-2xl rounded-3xl border border-black/10 bg-white p-6 shadow-2xl space-y-6"
            onMouseLeave={() => setHoverDate("")}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">
                  {selectingEnd && dates.startDate ? "Select End Date" : "Select Start Date"}
                </p>
                <p className="text-base font-black uppercase text-black mt-0.5">
                  {displayLabel()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCalendarOpen(false)}
                className="h-8 w-8 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:bg-black/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Month Nav Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const d = new Date(viewYear, viewMonth - 1, 1);
                  setViewMonth(d.getMonth());
                  setViewYear(d.getFullYear());
                }}
                disabled={prevMonthDisabled}
                className="h-8 w-8 rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date(viewYear, viewMonth + 2, 1);
                  setViewMonth(d.getMonth());
                  setViewYear(d.getFullYear());
                }}
                className="h-8 w-8 rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black/5"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Dual Month Calendar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CalendarMonth
                year={viewYear}
                month={viewMonth}
                startDate={dates.startDate}
                endDate={dates.endDate}
                hoverDate={hoverDate}
                today={today}
                onDateClick={handleDateClick}
                onDateHover={setHoverDate}
              />
              <CalendarMonth
                year={nextYear}
                month={nextMonth}
                startDate={dates.startDate}
                endDate={dates.endDate}
                hoverDate={hoverDate}
                today={today}
                onDateClick={handleDateClick}
                onDateHover={setHoverDate}
              />
            </div>

            {/* Confirm button */}
            {dates.startDate && dates.endDate && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCalendarOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-colors shadow-md"
                >
                  Confirm Dates
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
