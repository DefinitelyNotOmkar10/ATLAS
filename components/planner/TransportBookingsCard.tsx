import { TransportBooking } from '@/lib/types/itinerary';
import { Ticket, ExternalLink } from 'lucide-react';

interface TransportBookingsCardProps {
  bookings: TransportBooking[];
}

export default function TransportBookingsCard({ bookings }: TransportBookingsCardProps) {
  if (!bookings || bookings.length === 0) return null;

  return (
    <div className="mt-8 mb-8 rounded-3xl p-6 sm:p-8 border border-black/10 bg-white shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center">
            <Ticket className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase text-black">
              Verified Transit Bookings
            </h3>
            <p className="text-xs font-bold text-black/50">
              Direct booking platforms for flights, rail, and road transfers
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking, index) => (
          <a
            key={index}
            href={booking.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl border border-black/10 bg-black/[0.015] hover:border-blue-600 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  {booking.type}
                </span>
                <ExternalLink className="w-4 h-4 text-black/40 group-hover:text-blue-600 transition-colors" />
              </div>

              <h4 className="text-base font-black uppercase text-black group-hover:text-blue-600 transition-colors">
                {booking.name}
              </h4>

              <p className="text-xs font-medium text-black/60 mt-1">
                {booking.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-black">
              <span>Book Tickets</span>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
