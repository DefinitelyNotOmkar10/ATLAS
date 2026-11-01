"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "ATLAS turned our chaotic family vacation into the trip of a lifetime. Every detail was perfect!",
    by: "Sarah, Travel Enthusiast from NYC",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    tempId: 1,
    testimonial: "I used to spend weeks planning trips. With ATLAS, I got a personalized itinerary in minutes!",
    by: "Marcus, Adventure Seeker from Austin",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    tempId: 2,
    testimonial: "The AI recommendations were spot-on! Discovered hidden gems I would have never found on my own.",
    by: "Emily, Solo Traveler from London",
    imgSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  },
  {
    tempId: 3,
    testimonial: "Planning our honeymoon was effortless. ATLAS understood exactly what we were looking for!",
    by: "Jake & Maya, Newlyweds from San Francisco",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12. This is the future of travel planning!",
    by: "Andre, Digital Nomad from Bali",
    imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
  },
  {
    tempId: 5,
    testimonial: "SO SO SO HAPPY WE FOUND ATLAS!!!! Saved me 100+ hours of research and planning.",
    by: "Jennifer, Busy Mom from Chicago",
    imgSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
  },
  {
    tempId: 6,
    testimonial: "Took some convincing, but now that we're using ATLAS, we're never going back to spreadsheets!",
    by: "David, Group Trip Organizer from Seattle",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
  },
  {
    tempId: 7,
    testimonial: "The budget tracking feature is genius. We stayed on budget and still had amazing experiences!",
    by: "Rachel, Budget Traveler from Toronto",
    imgSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop"
  },
  {
    tempId: 8,
    testimonial: "It's just the best trip planner. Period. Nothing else comes close.",
    by: "Fernando, Travel Blogger from Madrid",
    imgSrc: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop"
  },
  {
    tempId: 9,
    testimonial: "I switched from other planners 2 years ago and never looked back. ATLAS is unmatched!",
    by: "Andy, Frequent Flyer from Dubai",
    imgSrc: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop"
  },
  {
    tempId: 10,
    testimonial: "I've been searching for an AI trip planner like this for YEARS. Finally found the perfect one!",
    by: "Priya, Tech Professional from Bangalore",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
  },
  {
    tempId: 11,
    testimonial: "So simple and intuitive! Got our whole family up to speed in 10 minutes before our vacation.",
    by: "Marina, Cruise Enthusiast from Miami",
    imgSrc: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop"
  },
  {
    tempId: 12,
    testimonial: "The personalized recommendations feel like having a local friend in every city we visit!",
    by: "Olivia, Culture Explorer from Paris",
    imgSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop"
  },
  {
    tempId: 13,
    testimonial: "The efficiency gains are incredible! Now I plan trips in hours instead of weeks.",
    by: "Raj, Business Traveler from Singapore",
    imgSrc: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop"
  },
  {
    tempId: 14,
    testimonial: "ATLAS revolutionized how we plan our annual family reunions. It's a total game-changer!",
    by: "Lila, Family Coordinator from Boston",
    imgSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop"
  },
  {
    tempId: 15,
    testimonial: "The itineraries grow with your trip! Added 3 extra days mid-planning and it adapted perfectly.",
    by: "Trevor, Road Trip Enthusiast from Denver",
    imgSrc: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop"
  },
  {
    tempId: 16,
    testimonial: "I love how ATLAS keeps getting better. The new features are always exactly what I need!",
    by: "Naomi, Early Adopter from Tokyo",
    imgSrc: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop"
  },
  {
    tempId: 17,
    testimonial: "Best investment for travelers! The time and stress it saves is worth 100x the cost.",
    by: "Victor, Vacation Planner from Mexico City",
    imgSrc: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop"
  },
  {
    tempId: 18,
    testimonial: "Robust AI features yet so easy to use. Perfect balance of power and simplicity!",
    by: "Yuki, Photographer from Kyoto",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    tempId: 19,
    testimonial: "We've tried every travel app out there. ATLAS stands out in reliability and quality!",
    by: "Zoe, Travel Agent from Sydney",
    imgSrc: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer transition-all duration-500 ease-in-out",
        "p-4"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        backgroundColor: '#000000',
        color: '#FFF6CB',
        border: '2px solid #6B7280',
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(255, 177, 0, 0.3)" : "0px 0px 0px 0px transparent",
        zIndex: isCenter ? 10 : 0
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
          backgroundColor: isCenter ? '#FFB100' : 'rgba(255, 177, 0, 0.3)'
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-2 h-10 w-10 object-cover object-top"
        style={{
          boxShadow: "2px 2px 0px #FFF6CB"
        }}
      />
      <h3 className="text-sm sm:text-base font-medium leading-snug">
        "{testimonial.testimonial}"
      </h3>
      <p className="absolute bottom-4 left-4 right-4 mt-2 text-xs italic" style={{ opacity: 0.7 }}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(280);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 280 : 240);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ 
        height: 500,
        backgroundColor: '#000000'
      }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-10 w-10 items-center justify-center text-xl transition-all duration-300",
            "border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          )}
          style={{
            backgroundColor: '#FFF6CB',
            borderColor: '#FFB100',
            color: '#063559'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFB100';
            e.currentTarget.style.color = '#FFF6CB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFF6CB';
            e.currentTarget.style.color = '#063559';
          }}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-10 w-10 items-center justify-center text-xl transition-all duration-300",
            "border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          )}
          style={{
            backgroundColor: '#FFF6CB',
            borderColor: '#FFB100',
            color: '#063559'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFB100';
            e.currentTarget.style.color = '#FFF6CB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFF6CB';
            e.currentTarget.style.color = '#063559';
          }}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

