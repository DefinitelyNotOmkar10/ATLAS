import { Activity } from '@/lib/types/itinerary';
import { Clock, Sun, Sunrise, Sunset, Sparkles } from 'lucide-react';

interface ActivityBlockProps {
  title: string;
  activity: Activity;
}

export default function ActivityBlock({ title, activity }: ActivityBlockProps) {
  const getIcon = () => {
    switch (title.toLowerCase()) {
      case 'morning':
        return <Sunrise className="w-4 h-4 text-blue-600" />;
      case 'afternoon':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'evening':
        return <Sunset className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-black/10 bg-black/[0.015] hover:border-black/25 transition-all space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-[11px] font-black uppercase tracking-widest text-black/60">
            {title}
          </span>
        </div>
        {activity.estimated_cost && (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black tracking-wider">
            ₹{activity.estimated_cost}
          </span>
        )}
      </div>

      <h4 className="text-base font-black uppercase tracking-tight text-black">
        {activity.name}
      </h4>

      <p className="text-xs font-medium text-black/70 leading-relaxed">
        {activity.description}
      </p>

      {activity.duration && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-black/40 pt-1">
          <Clock className="w-3 h-3" />
          <span>Duration: {activity.duration}</span>
        </div>
      )}
    </div>
  );
}
