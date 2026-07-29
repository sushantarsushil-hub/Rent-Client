import React, { useState } from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import StatusBadge from '../../components/ui/StatusBadge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MapPin, Calendar, Eye } from 'lucide-react';

const sampleBookings = [
  {
    id: 'BK-9842',
    propertyTitle: 'Luxury Oceanfront Villa',
    location: 'Malibu, California',
    checkIn: '2026-08-10',
    checkOut: '2026-08-14',
    totalPrice: 1875,
    status: 'Confirmed',
    guests: 4,
  },
  {
    id: 'BK-9843',
    propertyTitle: 'Modern Downtown Penthouse',
    location: 'New York City, NY',
    checkIn: '2026-09-01',
    checkOut: '2026-09-04',
    totalPrice: 1035,
    status: 'Pending',
    guests: 2,
  },
  {
    id: 'BK-9844',
    propertyTitle: 'Alpine Chalet with Mountain Views',
    location: 'Aspen, Colorado',
    checkIn: '2026-07-02',
    checkOut: '2026-07-06',
    totalPrice: 2395,
    status: 'Completed',
    guests: 6,
  },
];

const MyBookings = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const tableHeaders = ['Booking ID', 'Property Destination', 'Dates', 'Guests', 'Total Price', 'Status', 'Actions'];

  return (
    <div className="space-y-8">
      <SectionTitle
        badge="Reservations"
        title="My Bookings"
        subtitle="Manage upcoming rental stays, check reservation statuses, and view receipts."
      />

      <Table headers={tableHeaders}>
        {sampleBookings.map((b) => (
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
              <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(b.checkIn)} - {formatDate(b.checkOut)}
              </div>
            </TableCell>
            <TableCell className="text-xs font-semibold text-slate-700">{b.guests} Guests</TableCell>
            <TableCell className="font-extrabold text-sm text-slate-900">
              {formatCurrency(b.totalPrice)}
            </TableCell>
            <TableCell>
              <StatusBadge status={b.status} />
            </TableCell>
            <TableCell align="right">
              <Button variant="ghost" size="sm" icon={Eye}>
                Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Pagination currentPage={currentPage} totalPages={2} onPageChange={setCurrentPage} />
    </div>
  );
};

export default MyBookings;
