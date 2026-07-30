'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { MapPin, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import StripeCheckoutForm from '../../components/payment/StripeCheckoutForm';
import stripePromise from '../../utils/stripe';
import { useAppRouter } from '../../hooks/useAppRouter';
import { createStripePaymentIntent } from '../../api/paymentService';
import { fetchPropertyDetails } from '../../api/propertyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { formatCurrency } from '../../utils/formatters';

export const PaymentCheckout = () => {
  const router = useAppRouter();
  const searchParams = useSearchParams();

  const propertyId = searchParams.get('propertyId') || 'prop-1';
  const moveInDate = searchParams.get('moveInDate') || new Date().toISOString().split('T')[0];
  const phone = searchParams.get('phone') || '+1 (555) 234-5678';

  const [intentData, setIntentData] = useState(null);
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initCheckoutSession = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        
        let propData = null;
        try {
          propData = await fetchPropertyDetails(propertyId);
        } catch (_err) {
          propData = {
            id: propertyId,
            title: 'Modern Urban Apartment Stay',
            location: 'Gulshan 2, Dhaka',
            price: 450,
            image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80',
          };
        }

        if (!isMounted) return;
        setProperty(propData);

        const totalAmount = (propData?.price || propData?.rent || 450) * 3 + 75;

        
        const intent = await createStripePaymentIntent({
          propertyId,
          amount: totalAmount,
          moveInDate,
          phone,
        });

        if (!isMounted) return;
        setIntentData(intent);
      } catch (err) {
        console.error('Failed to initialize payment checkout:', err);
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initCheckoutSession();

    return () => {
      isMounted = false;
    };
  }, [propertyId, moveInDate, phone]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Initializing Stripe secure checkout session..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ErrorState
          title="Payment Session Error"
          description="Could not initialize secure Stripe checkout session. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const activePrice = property?.price || property?.rent || 450;
  const totalAmount = intentData?.amount || activePrice * 3 + 75;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" /> Back to Property Details
        </button>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-extrabold uppercase tracking-wider border border-blue-200 flex items-center gap-1">
          <CreditCard className="w-3.5 h-3.5" /> Stripe Payment Gateway
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
       
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={property?.image || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80'}
              alt={property?.title || 'Property'}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">
              {property?.title || 'Urban Property Stay'}
            </h3>
            <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {property?.location || 'Dhaka, Bangladesh'}
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-600 font-bold border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span>Move-in Date</span>
              <span className="text-slate-900 font-black">{moveInDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Rental Rate (3 nights)</span>
              <span>{formatCurrency(activePrice * 3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning & Service fee</span>
              <span>{formatCurrency(75)}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Payable</span>
              <span className="text-emerald-700">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2 text-[11px] font-bold text-blue-800">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Only publishable Stripe keys are exposed.</span>
          </div>
        </div>

        
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md">
          <Elements stripe={stripePromise}>
            <StripeCheckoutForm
              property={property}
              bookingData={{ moveInDate, phone }}
              intentData={intentData}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
