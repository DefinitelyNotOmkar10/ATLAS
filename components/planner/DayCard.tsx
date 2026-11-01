import { DayItinerary } from '@/lib/types/itinerary';
import ActivityBlock from './ActivityBlock';
import MealCard from './MealCard';
import { Calendar } from 'lucide-react';

interface DayCardProps {
  day: DayItinerary;
  isStreaming: boolean;
}

export default function DayCard({ day, isStreaming }: DayCardProps) {
  return (
    <div
      className={`mb-8 rounded-3xl p-6 sm:p-8 border border-black/10 bg-white shadow-sm print-avoid-break transition-all ${
        isStreaming ? 'animate-fadeIn' : ''
      }`}
    >
      <div className="flex items-center justify-between border-b border-black/10 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-black text-white text-xs font-black uppercase tracking-widest">
            Day 0{day.day}
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
            Daily Itinerary
          </h2>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-black/50 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          {day.date}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Morning, Afternoon, Evening Activities */}
        <div className="lg:col-span-2 space-y-4">
          <ActivityBlock title="Morning" activity={day.morning} />
          <ActivityBlock title="Afternoon" activity={day.afternoon} />
          <ActivityBlock title="Evening" activity={day.evening} />
        </div>

        {/* Meal Recommendations */}
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/40 block">
            Curated Dining
          </span>
          {day.meals.map((meal, idx) => (
            <MealCard key={idx} meal={meal} />
          ))}
        </div>
      </div>
    </div>
  );
}
