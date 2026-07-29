import React from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import StatusBadge from '../../components/ui/StatusBadge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Calendar, MapPin, CreditCard, Heart } from 'lucide-react';

const tenantBookings = [
  {
    id: 'BK-701',
    propertyTitle: 'Luxury Oceanfront Villa',
    location: 'Malibu, California',
    checkIn: '2026-08-10',
    checkOut: '2026-08-14',
    totalPrice: 1875,
    status: 'Confirmed',
  },
  {
    id: 'BK-702',
    propertyTitle: 'Modern Downtown Penthouse',
    location: 'New York City, NY',
    checkIn: '2026-09-01',
    checkOut: '2026-09-04',
    totalPrice: 1035,
    status: 'Pending',
  },
];

export const TenantDashboard = () => {
  return (
    <div className="space-y-8">
      <SectionTitle
        badge="Guest Portal"
        title="Tenant Dashboard"
        subtitle="Manage your upcoming stay reservations, saved properties, and rental receipts."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Booked Stays</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">2 Stays</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Spent</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(2910)}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Saved Wishlist</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">5 Properties</h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tenant Stays Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Your Upcoming Reservations</h3>
        <Table headers={['Booking Ref', 'Property', 'Dates', 'Total', 'Status', 'Actions']}>
          {tenantBookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-mono font-bold text-xs text-blue-700">{b.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">{b.propertyTitle}</p>
                  <span className="text-xs text-slate-500 font-normal flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-700" /> {b.location}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs text-slate-700 font-medium">
                  {formatDate(b.checkIn)} - {formatDate(b.checkOut)}
                </div>
              </TableCell>
              <TableCell className="font-bold text-slate-900">{formatCurrency(b.totalPrice)}</TableCell>
              <TableCell>
                <StatusBadge status={b.status} />
              </TableCell>
              <TableCell align="right">
                <Button variant="outline" size="sm">
                  View Receipt
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default TenantDashboard;
