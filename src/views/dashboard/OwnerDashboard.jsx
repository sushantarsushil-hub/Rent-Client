import React from 'react';
import SectionTitle from '../../components/common/SectionTitle';
import StatusBadge from '../../components/ui/StatusBadge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Building, DollarSign, Users, PlusCircle } from 'lucide-react';

const ownerProperties = [
  {
    id: 'prop-101',
    title: 'Luxury Oceanfront Villa',
    location: 'Malibu, California',
    price: 450,
    status: 'Active',
    occupancy: '92%',
  },
  {
    id: 'prop-102',
    title: 'Modern Downtown Penthouse',
    location: 'New York City, NY',
    price: 320,
    status: 'Active',
    occupancy: '85%',
  },
];

export const OwnerDashboard = () => {
  return (
    <div className="space-y-8">
      <SectionTitle
        badge="Host Management"
        title="Owner Dashboard"
        subtitle="Manage your property listings, review guest occupancy rates, and monitor rental revenue."
        action={
          <Button variant="primary" icon={PlusCircle} size="sm">
            Add New Property
          </Button>
        }
      />

     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Listed Properties</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">2 Listings</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(44400)}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Occupancy</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">88.5%</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Your Property Listings</h3>
        <Table headers={['Property ID', 'Title & Location', 'Nightly Price', 'Occupancy', 'Status', 'Actions']}>
          {ownerProperties.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono font-bold text-xs text-blue-700">{p.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.location}</p>
                </div>
              </TableCell>
              <TableCell className="font-extrabold text-slate-900">{formatCurrency(p.price)}/night</TableCell>
              <TableCell className="font-semibold text-slate-700">{p.occupancy}</TableCell>
              <TableCell>
                <StatusBadge status={p.status} />
              </TableCell>
              <TableCell align="right">
                <Button variant="outline" size="sm">
                  Edit Property
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default OwnerDashboard;
