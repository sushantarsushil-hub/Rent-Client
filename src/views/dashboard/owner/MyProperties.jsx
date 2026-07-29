'use client';

import React, { useState } from 'react';
import { PlusCircle, Eye, Edit, Trash2, AlertCircle, Save } from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle';
import StatusBadge from '../../../components/ui/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { useOwnerProperties, deleteOwnerProperty, updateOwnerProperty } from '../../../api/ownerService';
import { useAppRouter } from '../../../hooks/useAppRouter';
import { formatCurrency } from '../../../utils/formatters';
import { showToast } from '../../../utils/toast';

export const MyProperties = () => {
  const router = useAppRouter();
  const { data: properties, isLoading, isError, refetch } = useOwnerProperties();

  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    rent: '',
    location: '',
    propertyType: 'Apartment',
    rentType: 'Monthly',
    bedrooms: 1,
    bathrooms: 1,
    propertySize: 1000,
    description: '',
    image: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletePropertyId, setDeletePropertyId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenEdit = (prop) => {
    setEditingProperty(prop);
    setEditFormData({
      title: prop.title || '',
      rent: prop.price || prop.rent || 0,
      location: prop.location || '',
      propertyType: prop.propertyType || prop.type || 'Apartment',
      rentType: prop.rentType || 'Monthly',
      bedrooms: prop.bedrooms || prop.beds || 1,
      bathrooms: prop.bathrooms || prop.baths || 1,
      propertySize: prop.propertySize || prop.sqft || 1000,
      description: prop.description || '',
      image: prop.image || (prop.images && prop.images[0]) || '',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProperty) return;

    setIsUpdating(true);
    try {
      await updateOwnerProperty(editingProperty.id, {
        title: editFormData.title,
        rent: Number(editFormData.rent),
        location: editFormData.location,
        propertyType: editFormData.propertyType,
        rentType: editFormData.rentType,
        bedrooms: Number(editFormData.bedrooms),
        bathrooms: Number(editFormData.bathrooms),
        propertySize: Number(editFormData.propertySize),
        description: editFormData.description,
        images: editFormData.image ? [editFormData.image] : editingProperty.images || [],
      });
      showToast.success('Property details updated successfully. Status reset to PENDING for admin review.');
      setEditingProperty(null);
      refetch();
    } catch (err) {
      showToast.error('Failed to update property details.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletePropertyId) return;

    setIsDeleting(true);
    try {
      await deleteOwnerProperty(deletePropertyId);
      showToast.info('Property listing deleted successfully.');
      setDeletePropertyId(null);
      refetch();
    } catch (err) {
      showToast.error('Failed to delete property listing.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="Owner Portfolio"
        title="My Properties"
        subtitle="Manage all properties created by you. View listing status (Pending, Approved, Rejected), update details, or delete listings."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => router.push('/dashboard/owner/add-property')}
            className="font-extrabold shadow-md shadow-blue-500/20"
          >
            Add Property
          </Button>
        }
      />

      {isLoading && (
        <div className="py-16 text-center">
          <LoadingSpinner size="lg" text="Loading your listed properties..." />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorState
          title="Unable to load properties"
          description="Failed to retrieve your property listings."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && properties?.length === 0 && (
        <EmptyState
          title="No properties listed yet"
          description="Click 'Add Property' to submit your first rental property for admin approval."
          actionText="Add Property Now"
          onAction={() => router.push('/dashboard/owner/add-property')}
        />
      )}

      {!isLoading && !isError && properties?.length > 0 && (
        <>
          {/* Table Format (Desktop) */}
          <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Property Title</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Rent</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <img
                          src={prop.image || (prop.images && prop.images[0]) || (prop.gallery && prop.gallery[0]) || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400'}
                          alt={prop.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">{prop.title}</td>
                      <td className="p-4 text-slate-600 font-bold">{prop.location}</td>
                      <td className="p-4 font-black text-slate-900">
                        {formatCurrency(prop.price || prop.rent || 0)}
                        <span className="text-[10px] text-slate-400 font-bold block">{prop.rentType || 'Monthly'}</span>
                      </td>
                      <td className="p-4 text-slate-600 font-bold">{prop.propertyType || prop.type}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={prop.status || 'Pending'} />

                          {(prop.status || '').toLowerCase() === 'rejected' && (
                            <button
                              onClick={() => setSelectedPropertyForModal(prop)}
                              title="View Rejection Feedback"
                              className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/properties/${prop.id}`)}
                            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(prop)}
                            className="p-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                            title="Update Listing"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletePropertyId(prop.id)}
                            className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards Format (Mobile) */}
          <div className="lg:hidden space-y-4">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={prop.image || (prop.images && prop.images[0]) || (prop.gallery && prop.gallery[0]) || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400'}
                    alt={prop.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">{prop.title}</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">{prop.location}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusBadge status={prop.status || 'Pending'} />
                      {(prop.status || '').toLowerCase() === 'rejected' && (
                        <button
                          onClick={() => setSelectedPropertyForModal(prop)}
                          className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 font-bold text-[10px] border border-rose-200 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-slate-400 font-bold block">Rent</span>
                    <span className="font-black text-slate-900">
                      {formatCurrency(prop.price || prop.rent || 0)} ({prop.rentType || 'Monthly'})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Property Type</span>
                    <span className="font-bold text-slate-800">{prop.propertyType || prop.type}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => router.push(`/properties/${prop.id}`)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(prop)}
                    className="p-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                    title="Update Listing"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletePropertyId(prop.id)}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Admin Rejection Feedback Modal */}
      {selectedPropertyForModal && (
        <Modal
          isOpen={!!selectedPropertyForModal}
          onClose={() => setSelectedPropertyForModal(null)}
          title="Admin Rejection Feedback"
        >
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-extrabold text-rose-900">Rejection Reason for "{selectedPropertyForModal.title}"</h4>
                <p className="text-rose-700 font-medium leading-relaxed">
                  {selectedPropertyForModal.rejectionFeedback ||
                    'Admin feedback: Listing details or image documentation need clarification before approval.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedPropertyForModal(null)}>
                Close Feedback
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Property Details Modal */}
      {editingProperty && (
        <Modal
          isOpen={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          title="Update Property Details"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Property Title</label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Rent Amount ($)</label>
                <input
                  type="number"
                  value={editFormData.rent}
                  onChange={(e) => setEditFormData({ ...editFormData, rent: e.target.value })}
                  required
                  min={1}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Rent Type</label>
                <select
                  value={editFormData.rentType}
                  onChange={(e) => setEditFormData({ ...editFormData, rentType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Property Type</label>
                <select
                  value={editFormData.propertyType}
                  onChange={(e) => setEditFormData({ ...editFormData, propertyType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="House">House</option>
                  <option value="Loft">Loft</option>
                  <option value="Chalet">Chalet</option>
                  <option value="Studio">Studio</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={editFormData.bedrooms}
                  onChange={(e) => setEditFormData({ ...editFormData, bedrooms: e.target.value })}
                  min={0}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={editFormData.bathrooms}
                  onChange={(e) => setEditFormData({ ...editFormData, bathrooms: e.target.value })}
                  min={0}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Size (sqft)</label>
                <input
                  type="number"
                  value={editFormData.propertySize}
                  onChange={(e) => setEditFormData({ ...editFormData, propertySize: e.target.value })}
                  min={10}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Image URL</label>
              <input
                type="url"
                value={editFormData.image}
                onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setEditingProperty(null)} disabled={isUpdating}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isUpdating} icon={Save}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Property Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletePropertyId}
        title="Delete Property Listing?"
        message="Are you sure you want to delete this property listing? This action cannot be undone."
        confirmText="Delete Listing"
        isDanger
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletePropertyId(null)}
      />
    </div>
  );
};

export default MyProperties;
