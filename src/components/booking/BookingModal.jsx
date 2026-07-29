import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Calendar, Phone, User, Mail, CreditCard } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAuth } from '../../providers/AuthProvider';
import { formatCurrency } from '../../utils/formatters';
import { showToast } from '../../utils/toast';

export const BookingModal = ({ isOpen, onClose, property }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      moveInDate: todayStr,
      phone: '+1 (555) 234-5678',
      userName: user?.name || 'Tenant Guest',
      userEmail: user?.email || 'tenant@example.com',
      notes: '',
    },
  });

  
  useEffect(() => {
    if (user) {
      setValue('userName', user.name || 'Tenant Guest');
      setValue('userEmail', user.email || 'tenant@example.com');
    }
  }, [user, setValue]);

  if (!property) return null;

  const pricePerNight = property.price || property.rent || 0;
  const totalAmount = pricePerNight * 3 + 75;

  const handleProceedToPayment = (formData) => {
    if (!isAuthenticated) {
      showToast.error('Please login to complete property reservation.');
      router.push(`/login?redirect=${encodeURIComponent(`/properties/${property.id || property._id}`)}`);
      onClose();
      return;
    }

    const params = new URLSearchParams({
      propertyId: property.id || property._id || 'prop-1',
      moveInDate: formData.moveInDate,
      phone: formData.phone,
    });

    if (formData.notes) {
      params.set('notes', formData.notes);
    }

    showToast.success('Reservation details verified! Opening payment process...');
    onClose();
    router.push(`/payment/checkout?${params.toString()}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Property Reservation" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(handleProceedToPayment)} className="space-y-5">
       
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/90">
          <img
            src={property.image || (property.gallery && property.gallery[0])}
            alt={property.title}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="space-y-0.5">
            <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">{property.title}</h4>
            <p className="text-xs text-slate-500 font-bold">{property.location}</p>
            <p className="text-xs font-black text-blue-700">
              Total Amount: {formatCurrency(totalAmount)} (3 nights + fees)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1 ml-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" /> Move-in Date
            </label>
            <input
              type="date"
              min={todayStr}
              {...register('moveInDate', {
                required: 'Move-in date is required',
                validate: (val) =>
                  new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0)) ||
                  'Move-in date cannot be in the past',
              })}
              className={`w-full bg-slate-50 border rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none ${
                errors.moveInDate ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
              }`}
            />
            {errors.moveInDate && (
              <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.moveInDate.message}</p>
            )}
          </div>

          
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1 ml-1">
              <Phone className="w-3.5 h-3.5 text-blue-600" /> Contact Phone
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register('phone', {
                required: 'Contact phone number is required',
                pattern: {
                  value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]{6,15}$/,
                  message: 'Please enter a valid phone number',
                },
              })}
              className={`w-full bg-slate-50 border rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none ${
                errors.phone ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
              }`}
            />
            {errors.phone && (
              <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.phone.message}</p>
            )}
          </div>

         
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1 ml-1">
              <User className="w-3.5 h-3.5 text-blue-600" /> Guest Name
            </label>
            <input
              type="text"
              readOnly
              {...register('userName')}
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-600 cursor-not-allowed"
            />
          </div>

         
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1 ml-1">
              <Mail className="w-3.5 h-3.5 text-blue-600" /> Guest Email
            </label>
            <input
              type="email"
              readOnly
              {...register('userEmail')}
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-600 cursor-not-allowed"
            />
          </div>
        </div>

        
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1 ml-1">
            Additional Notes / Special Requests
          </label>
          <textarea
            {...register('notes')}
            rows={2}
            placeholder="Arrival details or special accommodations..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

       
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} className="font-bold">
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            icon={CreditCard}
            className="px-6 font-extrabold shadow-lg shadow-blue-500/20 text-xs"
          >
            Proceed to Payment Process
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;


