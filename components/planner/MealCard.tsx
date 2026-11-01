import { MealSpot } from '@/lib/types/itinerary';
import { Utensils, MapPin, Coffee, Wine } from 'lucide-react';

interface MealCardProps {
  meal: MealSpot;
}

export default function MealCard({ meal }: MealCardProps) {
  const getMealIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return <Coffee className="w-3.5 h-3.5 text-amber-600" />;
      case 'dinner':
        return <Wine className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Utensils className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-black/10 bg-black/[0.015] hover:border-black/25 transition-all space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {getMealIcon(meal.type)}
          <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
            {meal.type}
          </span>
        </div>
        {meal.price_range && (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/5 text-black/70">
            {meal.price_range}
          </span>
        )}
      </div>

      <h5 className="text-xs font-black uppercase text-black">
        {meal.name}
      </h5>

      {meal.cuisine && (
        <p className="text-[11px] font-bold text-blue-600">
          {meal.cuisine}
        </p>
      )}

      {meal.location && (
        <p className="text-[10px] font-medium text-black/50 flex items-center gap-1 pt-0.5">
          <MapPin className="w-3 h-3 text-black/40 shrink-0" />
          <span className="truncate">{meal.location}</span>
        </p>
      )}
    </div>
  );
}
