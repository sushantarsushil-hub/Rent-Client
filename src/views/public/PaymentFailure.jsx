'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import Button from '../../components/ui/Button';

export const PaymentFailure = () => {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error') || 'Your payment authorization request was declined by the card issuing bank.';

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-md text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border-2 border-rose-200 shadow-sm">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-extrabold uppercase tracking-wider border border-rose-200 inline-block">
            Payment Failed
          </span>
          <h1 className="text-2xl font-black text-slate-900">Transaction Not Completed</h1>
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            We were unable to process your Stripe booking payment.
          </p>
        </div>

        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 text-left space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" /> Error Details:
          </div>
          <p className="text-xs text-rose-800 font-medium leading-normal">{errorMessage}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/payment/checkout" className="flex-1">
            <Button variant="primary" fullWidth icon={RefreshCw} size="sm">
              Retry Payment
            </Button>
          </Link>
          <Link href="/properties" className="flex-1">
            <Button variant="outline" fullWidth icon={Home} size="sm">
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
