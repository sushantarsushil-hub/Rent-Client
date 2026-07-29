import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, CalendarCheck, Home } from 'lucide-react';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';

export const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get('txn') || 'TXN-88401';
  const bookingId = searchParams.get('booking') || 'BK-9842';
  const amount = Number(searchParams.get('amount')) || 1425;
  const propertyTitle = searchParams.get('property') || 'Luxury Oceanfront Villa';

  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard/tenant/bookings');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-md text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm animate-bounce-short">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-extrabold uppercase tracking-wider border border-emerald-200 inline-block">
            Payment Verified
          </span>
          <h1 className="text-2xl font-black text-slate-900">Reservation Confirmed!</h1>
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            Your Stripe payment has been processed and verified by backend services.
          </p>
          <div className="pt-2 text-xs font-bold text-blue-700 bg-blue-50 py-2 px-4 rounded-xl border border-blue-200 inline-block">
            Redirecting to <span className="font-extrabold text-slate-900">My Bookings</span> in {countdown}s...
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Property:</span>
            <span className="font-bold text-slate-900 truncate max-w-[180px]">{propertyTitle}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Booking Ref:</span>
            <span className="font-mono font-bold text-blue-700">{bookingId}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Transaction ID:</span>
            <span className="font-mono font-bold text-slate-800">{transactionId}</span>
          </div>
          <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1">
            <span>Total Paid:</span>
            <span className="text-emerald-700">{formatCurrency(amount)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/dashboard/tenant/bookings" className="flex-1">
            <Button variant="primary" fullWidth icon={CalendarCheck} size="sm" className="font-extrabold">
              Go to My Bookings Now
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" fullWidth icon={Home} size="sm">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
