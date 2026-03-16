"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone,
  MessageSquare,
  Bookmark
} from 'lucide-react';

export default function FindBusinessPage() {
  const businesses = [
    { 
      id: 1, 
      name: "Chidi's Electronics", 
      category: "Tech & Repairs", 
      location: "Lagos, Nigeria", 
      rating: 4.8, 
      reviews: 124, 
      status: "Open",
      image: "https://images.unsplash.com/photo-1517060195028-608e54aa2df3?w=400&h=250&fit=crop"
    },
    { 
      id: 2, 
      name: "Mama Ayo's Kitchen", 
      category: "Restaurant", 
      location: "Abuja, Nigeria", 
      rating: 4.9, 
      reviews: 512, 
      status: "Busy",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop"
    },
    { 
      id: 3, 
      name: "Quick Wash Laundry", 
      category: "Services", 
      location: "Enugu, Nigeria", 
      rating: 4.5, 
      reviews: 89, 
      status: "Open",
      image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&h=250&fit=crop"
    },
    { 
      id: 4, 
      name: "Tega Fashion House", 
      category: "Tailoring", 
      location: "Warri, Nigeria", 
      rating: 4.7, 
      reviews: 156, 
      status: "Closed",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=250&fit=crop"
    },
    { 
      id: 5, 
      name: "Zina Beauty Spa", 
      category: "Wellness", 
      location: "Port Harcourt", 
      rating: 4.6, 
      reviews: 94, 
      status: "Open",
      image: "https://images.unsplash.com/photo-1540555700478-4be289aefec9?w=400&h=250&fit=crop"
    },
    { 
      id: 6, 
      name: "Auto Fix Pros", 
      category: "Automotive", 
      location: "Benin City", 
      rating: 4.4, 
      reviews: 67, 
      status: "Open",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop"
    },
  ];

  return (
    <DashboardLayout title="Find Businesses">
      <div className="space-y-10 animate-fade-in-up">
        
        {/* Search & Filter Header */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-[#00D18F]/20 blur-[60px] opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row gap-2 bg-white dark:bg-zinc-900/50 p-2 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] shadow-xl">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="text-zinc-500 w-5 h-5 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search for services, businesses, or products..." 
                className="w-full h-12 bg-transparent border-none outline-none font-medium text-sm text-zinc-900 dark:text-white"
              />
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-white/10 hidden sm:block self-center" />
            <div className="flex items-center px-4 gap-2 text-zinc-500">
              <MapPin size={18} />
              <select className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                <option>Nigeria</option>
                <option>Ghana</option>
                <option>Kenya</option>
              </select>
            </div>
            <button className="px-8 py-3 bg-[#00D18F] text-black rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-[#00D18F]/20">
              Search
            </button>
          </div>
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((biz) => (
            <div key={biz.id} className="voxy-card group overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-[#00D18F]/10 hover:-translate-y-1 transition-all">
              
              {/* Card Image Wrapper */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={biz.image} 
                  alt={biz.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                    {biz.category}
                  </span>
                </div>
                <button className="absolute top-4 right-4 p-2.5 bg-black/40 backdrop-blur-md text-white rounded-xl border border-white/20 hover:bg-[#00D18F] hover:text-black transition-all">
                  <Bookmark size={18} />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                    {biz.name}
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 text-amber-500 rounded-lg">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-black">{biz.rating}</span>
                  </div>
                </div>
                
                <p className="text-xs text-zinc-500 flex items-center gap-1.5 mb-4">
                  <MapPin size={12} /> {biz.location}
                </p>

                <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${biz.status === 'Closed' ? 'bg-red-500' : 'bg-[#00D18F]'} animate-pulse`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {biz.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-zinc-400 hover:text-[#00D18F] transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5">
                      <Phone size={18} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#00D18F]/10 text-[#00D18F] rounded-xl text-xs font-black hover:bg-[#00D18F] hover:text-black transition-all">
                      <MessageSquare size={16} />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
