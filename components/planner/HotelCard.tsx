import { HotelSuggestion } from '@/lib/types/itinerary';
import { MapPin, Check, Sparkles } from 'lucide-react';
import { getHotelImage } from '@/lib/utils/destinationImages';

interface HotelCardProps {
  hotel: HotelSuggestion;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const priceDisplay =
    hotel.price_per_night_display ||
    (typeof hotel.price_per_night === 'string'
      ? hotel.price_per_night
      : `₹${hotel.price_per_night} / night`);

  const hotelImage = getHotelImage(hotel.name);

  return (
    <div className="rounded-3xl border border-black/10 bg-white hover:border-blue-600 transition-all flex flex-col justify-between shadow-sm overflow-hidden group">
      {/* Real-World Hotel Photo Header */}
      <div className="relative h-44 w-full overflow-hidden bg-black/5">
        <img
          src={hotelImage}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10">
            {hotel.type || 'Boutique Stay'}
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black tracking-wider shadow-md">
            {priceDisplay}
          </span>
        </div>

        {/* Bottom Hotel Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
          <h5 className="text-sm font-black uppercase tracking-tight truncate drop-shadow-sm">
            {hotel.name}
          </h5>
        </div>
      </div>

      {/* Hotel Details Body */}
      <div className="p-4 space-y-3">
        {hotel.location && (
          <p className="text-xs font-medium text-black/60 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{hotel.location}</span>
          </p>
        )}

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="pt-2 border-t border-black/10">
            <div className="flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/[0.04] text-black/70 flex items-center gap-1"
                >
                  <Check className="w-2.5 h-2.5 text-blue-600" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
