'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  ChevronRight,
  Award,
  ArrowRight,
  Star,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle';
import PropertyCard from '../../components/ui/PropertyCard';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RatingStars from '../../components/ui/RatingStars';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { PropertyCardSkeleton } from '../../components/common/SkeletonLoader';
import { useFeaturedProperties, usePropertiesList } from '../../api/propertyService';

const topLocations = [
  { name: 'San Francisco, CA', properties: 42, image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&q=80' },
  { name: 'New York City, NY', properties: 86, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
  { name: 'Los Angeles, CA', properties: 58, image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=600&q=80' },
  { name: 'Miami Beach, FL', properties: 64, image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80' },
  { name: 'Austin, TX', properties: 35, image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=600&q=80' },
  { name: 'Seattle, WA', properties: 31, image: 'https://images.unsplash.com/photo-1502175371642-14a85483665e?auto=format&fit=crop&w=600&q=80' },
];

const customerReviews = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Tech Executive & Tenant',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Rentify made booking our 3-month San Francisco loft effortless. The host verification gives total peace of mind.',
    stayedAt: 'Downtown Modern Glass Loft',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'Remote Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Instant booking, zero hidden fees, and high-speed Wi-Fi guaranteed. Hands down the best rental platform I have used.',
    stayedAt: 'Waterfront Sunset Villa',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Architectural Designer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The property photos and amenity specs were 100% accurate. Smooth move-in and responsive host support throughout.',
    stayedAt: 'Minimalist Alpine Chalet',
  },
];

const trustedOwners = [
  {
    id: 1,
    name: 'Eleanor Vance',
    propertiesCount: 12,
    rating: 4.95,
    badge: 'Superhost • 4 Yrs',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    name: 'David Sterling',
    propertiesCount: 8,
    rating: 4.92,
    badge: 'Premier Host',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    name: 'Sophia Martinez',
    propertiesCount: 15,
    rating: 4.98,
    badge: 'Superhost • 6 Yrs',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
];

export const Home = () => {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const {
    data: featuredProperties,
    isLoading: isFeaturedLoading,
    isError: isFeaturedError,
    error: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedProperties();

  const { data: recentPropertiesData, isLoading: isRecentLoading } = usePropertiesList();
  const recentProperties = recentPropertiesData?.data?.slice(0, 3) || [];

  const handleSearchSubmit = (searchFilters) => {
    const params = new URLSearchParams();
    if (searchFilters?.location) params.set('search', searchFilters.location);
    if (searchFilters?.propertyType && searchFilters.propertyType !== 'All') params.set('propertyType', searchFilters.propertyType);
    if (searchFilters?.minPrice) params.set('minPrice', searchFilters.minPrice);
    if (searchFilters?.maxPrice) params.set('maxPrice', searchFilters.maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  // Accessible animation variants respecting prefers-reduced-motion
  const fadeSlideUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  };

  const fadeScale = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. Hero / Banner Section */}
      <section className="relative min-h-[640px] bg-slate-950 text-white flex items-center justify-center pt-16 pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />

          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Urban Property Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-purple-900/80 text-indigo-200 text-xs font-black border border-indigo-500/40 shadow-lg shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Modern Urban Rental & Booking Marketplace</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.15] break-words"
          >
            Find Your Dream Urban Stay & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Book Premium Rentals
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed px-2"
          >
            Seamlessly search, filter, and book verified oceanfront villas, downtown penthouses, and mountain chalets with instant host confirmation.
          </motion.p>

          {/* 2. Property Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-10"
          >
            <SearchBar onSearch={handleSearchSubmit} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto"
          >
            <Link href="/properties" className="w-full sm:w-auto">
              <Button variant="primary" size="md" icon={ChevronRight} className="w-full sm:w-auto font-extrabold shadow-lg shadow-blue-500/20">
                Explore All Listings
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto font-extrabold text-white border-slate-700 hover:bg-slate-800">
                Become a Host Owner
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3. Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Curated Listings"
          title="Featured Rental Destinations"
          subtitle="Hand-picked verified urban homes and luxury apartments ready for instant booking."
          action={
            <Link href="/properties">
              <Button variant="outline" size="sm" className="font-extrabold">
                View All Properties <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          }
        />

        {/* Loading Skeleton */}
        {isFeaturedLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mt-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <PropertyCardSkeleton key={idx} />
            ))}
          </div>
        )}

        {/* Error State Callout */}
        {isFeaturedError && !isFeaturedLoading && (
          <div className="mt-8">
            <ErrorState
              title="Unable to load featured properties"
              description="Could not connect to the rental service. Please retry."
              error={featuredError}
              onRetry={refetchFeatured}
            />
          </div>
        )}

        {/* Empty State */}
        {!isFeaturedLoading && !isFeaturedError && featuredProperties?.length === 0 && (
          <div className="mt-8">
            <EmptyState
              icon={Building2}
              title="No Featured Properties Found"
              description="There are currently no featured property listings available."
              actionText="Explore All Properties"
              onAction={() => router.push('/properties')}
            />
          </div>
        )}

        {/* Success Data Grid with Framer Motion Stagger Animation (Max 6) */}
        {!isFeaturedLoading && !isFeaturedError && featuredProperties?.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mt-8"
          >
            {featuredProperties.slice(0, 6).map((prop) => (
              <motion.div key={prop.id || prop._id} variants={fadeScale} className="h-full">
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="bg-white py-20 border-y border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Trust & Excellence"
            title="Why Guests & Hosts Choose Rentify"
            subtitle="Built with verified stay checks, transparent pricing, and instant host communications."
            center
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          >
            <motion.div variants={fadeSlideUp} className="p-7 bg-slate-50/80 rounded-3xl border border-slate-200/90 text-center space-y-4 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Verified Inspections</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Every property listing undergoes quality checks to guarantee safety, high-speed Wi-Fi, and accurate amenities.
              </p>
            </motion.div>

            <motion.div variants={fadeSlideUp} className="p-7 bg-slate-50/80 rounded-3xl border border-slate-200/90 text-center space-y-4 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                <Building2 className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Instant Online Booking</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Seamless reservation process with instant Stripe payment processing and immediate calendar updates.
              </p>
            </motion.div>

            <motion.div variants={fadeSlideUp} className="p-7 bg-slate-50/80 rounded-3xl border border-slate-200/90 text-center space-y-4 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-violet-500/20">
                <Award className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Superhost Standards</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Connect directly with top-rated hosts providing local recommendations and 24/7 guest care.
              </p>
            </motion.div>

            <motion.div variants={fadeSlideUp} className="p-7 bg-slate-50/80 rounded-3xl border border-slate-200/90 text-center space-y-4 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
                <HeartHandshake className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Dedicated Support</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Our support team is available around the clock to assist with check-in, host messaging, and stays.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Guest Feedback"
          title="What Our Tenants Say"
          subtitle="Real reviews from verified guests who booked stays through Rentify."
          center
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
        >
          {customerReviews.map((rev) => (
            <motion.div
              key={rev.id}
              variants={fadeSlideUp}
              className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <RatingStars rating={rev.rating} />
                <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-black text-slate-900 truncate">{rev.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold truncate">{rev.role}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Stayed at {rev.stayedAt}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. Top Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Popular Cities"
          title="Top Rental Destinations"
          subtitle="Explore trending cities and luxury coastal hubs with available listings."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8"
        >
          {topLocations.map((loc, index) => (
            <motion.div
              key={index}
              variants={fadeScale}
              onClick={() => router.push(`/properties?search=${encodeURIComponent(loc.name)}`)}
              className="group relative h-52 rounded-3xl overflow-hidden cursor-pointer shadow-sm border border-slate-200/90 hover:shadow-xl hover:border-blue-400 transition-all duration-300"
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                <h4 className="text-sm font-black text-white line-clamp-1">{loc.name}</h4>
                <p className="text-[11px] font-bold text-blue-300">{loc.properties} Available Stays</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 7. Recently Added Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Fresh Listings"
          title="Recently Added Properties"
          subtitle="Newly listed homes and lofts updated with latest pricing."
          action={
            <Link href="/properties">
              <Button variant="ghost" size="sm" className="font-extrabold text-blue-700">
                Explore All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          }
        />

        {isRecentLoading ? (
          <div className="py-12 text-center">
            <LoadingSpinner size="md" text="Loading recent listings..." />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6"
          >
            {recentProperties.map((prop) => (
              <motion.div key={prop.id || prop._id} variants={fadeScale} className="h-full">
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* 8. Rental Statistics */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-blue-400">12,500+</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Listings</p>
            </div>
            <div className="pt-4 md:pt-0 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-indigo-400">45,000+</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verified Stays</p>
            </div>
            <div className="pt-4 md:pt-0 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-violet-400">98.4%</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Host Satisfaction</p>
            </div>
            <div className="pt-4 md:pt-0 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-emerald-400">$24M+</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bookings Processed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Trusted Owners Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Superhost Partners"
          title="Meet Our Top-Rated Hosts"
          subtitle="Experienced property owners delivering exceptional guest hospitality."
          center
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {trustedOwners.map((owner) => (
            <div
              key={owner.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center gap-4 hover:border-blue-300 transition-colors"
            >
              <img
                src={owner.avatar}
                alt={owner.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shrink-0"
              />
              <div className="overflow-hidden space-y-1">
                <h4 className="text-sm font-black text-slate-900 truncate">{owner.name}</h4>
                <p className="text-xs font-bold text-blue-700">{owner.badge}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {owner.rating}
                  </span>
                  <span>•</span>
                  <span>{owner.propertiesCount} Managed Homes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Final Conversion CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-violet-950 text-white rounded-3xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-xl relative z-10">
            <span className="px-3.5 py-1 bg-indigo-500/30 text-indigo-200 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-400/40 inline-block">
              Host & Guest Partnership
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Book or List Your Urban Property?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Join thousands of tenants finding their next home and host owners expanding their rental revenue on Rentify.
            </p>
          </div>

          <div className="shrink-0 relative z-10 flex flex-col sm:flex-row gap-3">
            <Link href="/properties">
              <Button variant="primary" size="lg" icon={ArrowRight} className="py-4 shadow-xl shadow-blue-500/30 font-black">
                Browse Properties
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="py-4 font-black text-white border-indigo-400/50 hover:bg-indigo-900/50">
                List Property
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
