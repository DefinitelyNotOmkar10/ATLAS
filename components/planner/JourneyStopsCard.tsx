import { JourneyStop } from '@/lib/types/itinerary';
import { Compass, MapPin, Clock } from 'lucide-react';
import { getJourneyStopImage } from '@/lib/utils/destinationImages';

interface JourneyStopsCardProps {
  stops: JourneyStop[];
}

export default function JourneyStopsCard({ stops }: JourneyStopsCardProps) {
  if (!stops || stops.length === 0) return null;

  return (
    <div className="mb-8 rounded-3xl p-6 sm:p-8 border border-black/10 bg-white shadow-sm">
      <div className="mb-6 border-b border-black/10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-black">
              En-Route Journey Stops
            </h2>
            <p className="text-xs font-bold text-black/50">
              Curated sights and landmarks along your transit route
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-black/[0.04] text-[11px] font-black uppercase text-black/70">
          {stops.length} Stops
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stops.map((stop, index) => {
          const stopImage = getJourneyStopImage(stop.name, index);
          return (
            <div
              key={index}
              className="rounded-3xl border border-black/10 bg-white hover:border-black/30 transition-all flex flex-col justify-between shadow-sm overflow-hidden group"
            >
              {/* Real-World Landmark Photo Header */}
              <div className="relative h-40 w-full overflow-hidden bg-black/5">
                <img
                  src={stopImage}
                  alt={stop.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                    Stop 0{index + 1}
                  </span>
                  {stop.estimated_time && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {stop.estimated_time}
                    </span>
                  )}
                </div>

                {/* Bottom Landmark Name */}
                <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                  <h3 className="text-sm font-black uppercase tracking-tight truncate drop-shadow-sm">
                    {stop.name}
                  </h3>
                </div>
              </div>

              {/* Stop Details */}
              <div className="p-4 space-y-2">
                {stop.location && (
                  <p className="text-xs font-bold text-blue-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{stop.location}</span>
                  </p>
                )}

                <p className="text-xs font-medium text-black/70 leading-relaxed line-clamp-3">
                  {stop.description}
                </p>

                {stop.activities && stop.activities.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-black/10 flex flex-wrap gap-1">
                    {stop.activities.map((act, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/[0.03] border border-black/5 text-black/70"
                      >
                        • {act}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
