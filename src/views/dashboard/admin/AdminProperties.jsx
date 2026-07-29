'use client';

import React, { useState } from 'react';
import { useAppRouter } from '../../../hooks/useAppRouter';
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  AlertCircle,
  Send,
  Pencil,
  Building,
  MapPin,
  Calendar,
} from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import StatusBadge from '../../../components/ui/StatusBadge';
import Pagination from '../../../components/ui/Pagination';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import {
  useAdminProperties,
  approveAdminProperty,
  rejectAdminProperty,
  deleteAdminProperty,
} from '../../../api/adminService';
import { updateOwnerProperty } from '../../../api/ownerService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { showToast } from '../../../utils/toast';

export const AdminProperties = () => {
  const router = useAppRouter();
  const { data: properties = [], isLoading, isError, refetch } = useAdminProperties();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  
  const [approvePropertyId, setApprovePropertyId] = useState(null);
  const [isApproving, setIsApproving] = useState(false);

  
  const [selectedPropertyForReject, setSelectedPropertyForReject] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  
  const [deletePropertyId, setDeletePropertyId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  
  const handleConfirmApprove = async () => {
    if (!approvePropertyId) return;
    setIsApproving(true);
    try {
      await approveAdminProperty(approvePropertyId);
      showToast.success('Property approved successfully! Listing is now published.');
      setApprovePropertyId(null);
      refetch();
    } catch (_err) {
      showToast.error('Failed to approve property listing.');
    } finally {
      setIsApproving(false);
    }
  };

  
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionFeedback.trim()) {
      showToast.error('Rejection feedback is mandatory! Admin MUST provide rejection feedback.');
      return;
    }

    setIsSubmittingRejection(true);
    try {
      await rejectAdminProperty(selectedPropertyForReject.id, rejectionFeedback);
      showToast.success('Property listing rejected. Rejection feedback sent to host.');
      setSelectedPropertyForReject(null);
      setRejectionFeedback('');
      refetch();
    } catch (_err) {
      showToast.error('Failed to reject property listing.');
    } finally {
      setIsSubmittingRejection(false);
    }
  };

 
  const openEditModal = (prop) => {
    setEditingProperty(prop);
    setEditForm({
      title: prop.title || '',
      location: prop.location || '',
      rent: prop.price || prop.rent || 0,
      propertyType: prop.propertyType || prop.type || 'Apartment',
      bedrooms: prop.bedrooms || prop.beds || 1,
      bathrooms: prop.bathrooms || prop.baths || 1,
      propertySize: prop.propertySize || prop.sizeSqft || 0,
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingProperty) return;

    setIsUpdating(true);
    try {
      await updateOwnerProperty(editingProperty.id, editForm);
      showToast.success('Property details updated successfully!');
      setEditingProperty(null);
      refetch();
    } catch (_err) {
      showToast.error('Failed to update property details.');
    } finally {
      setIsUpdating(false);
    }
  };

  
  const handleConfirmDelete = async () => {
    if (!deletePropertyId) return;

    setIsDeleting(true);
    try {
      await deleteAdminProperty(deletePropertyId);
      showToast.success('Property listing removed from the platform.');
      setDeletePropertyId(null);
      refetch();
    } catch (_err) {
      showToast.error('Failed to delete property.');
    } finally {
      setIsDeleting(false);
    }
  };

  
  const filteredProperties = properties.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.ownerName || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q) ||
      (p.propertyType || p.type || '').toLowerCase().includes(q) ||
      (p.status || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <LoadingSpinner size="lg" text="Loading platform properties..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load properties"
        description="Failed to fetch property listings for moderation."
        onRetry={refetch}
      />
    );
  }

  const tableHeaders = ['Property', 'Owner', 'Location', 'Price', 'Type', 'Status', 'Created', 'Actions'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle
          badge="Platform Moderation"
          title="All Platform Properties"
          subtitle="Review pending listing applications, approve or reject properties with feedback, or remove listings."
        />

        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, owner, location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs"
          />
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <EmptyState
          title="No properties found"
          description="There are currently no property listings matching your search."
        />
      ) : (
        <>
         
          <div className="hidden lg:block">
            <Table headers={tableHeaders}>
              {paginatedProperties.map((prop) => (
                <TableRow key={prop.id}>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <span className="font-extrabold text-slate-900 text-sm leading-tight line-clamp-1">
                        {prop.title}
                      </span>
                    </div>
                  </TableCell>

                  
                  <TableCell className="text-xs font-bold text-slate-700">
                    {prop.ownerName}
                  </TableCell>

                  
                  <TableCell className="text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{prop.location}</span>
                    </span>
                  </TableCell>

                 
                  <TableCell className="font-extrabold text-sm text-slate-900">
                    {formatCurrency(prop.price)}
                  </TableCell>

                  
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      <Building className="w-3 h-3" />
                      {prop.propertyType || prop.type}
                    </span>
                  </TableCell>

                  
                  <TableCell>
                    <StatusBadge status={prop.status} />
                  </TableCell>
                  
                  <TableCell className="text-xs text-slate-500 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(prop.createdAt)}
                    </span>
                  </TableCell>

                  
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      {(prop.status || '').toLowerCase() !== 'approved' && (
                        <button
                          onClick={() => setApprovePropertyId(prop.id)}
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-xl hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Approve Listing"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}

                      {(prop.status || '').toLowerCase() !== 'rejected' && (
                        <button
                          onClick={() => {
                            setSelectedPropertyForReject(prop);
                            setRejectionFeedback('');
                          }}
                          className="px-2.5 py-1.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-xl hover:bg-amber-100 border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Reject Listing"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      )}

                      <button
                        onClick={() => openEditModal(prop)}
                        className="p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                        title="Update Property"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => router.push(`/properties/${prop.id}`)}
                        className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                        title="View Property"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletePropertyId(prop.id)}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          
          <div className="lg:hidden space-y-4">
            {paginatedProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">{prop.title}</h4>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {prop.location}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusBadge status={prop.status} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold">Owner</span>
                    <p className="font-bold text-slate-800">{prop.ownerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Price</span>
                    <p className="font-extrabold text-slate-900">{formatCurrency(prop.price)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Type</span>
                    <p className="font-bold text-slate-800">{prop.propertyType || prop.type}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Created</span>
                    <p className="font-bold text-slate-800">{formatDate(prop.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  {(prop.status || '').toLowerCase() !== 'approved' && (
                    <button
                      onClick={() => setApprovePropertyId(prop.id)}
                      className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-xl hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {(prop.status || '').toLowerCase() !== 'rejected' && (
                    <button
                      onClick={() => {
                        setSelectedPropertyForReject(prop);
                        setRejectionFeedback('');
                      }}
                      className="px-2.5 py-1.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-xl hover:bg-amber-100 border border-amber-200 flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(prop)}
                    className="p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => router.push(`/properties/${prop.id}`)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletePropertyId(prop.id)}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProperties.length}
            limit={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      
      <ConfirmDialog
        isOpen={!!approvePropertyId}
        title="Approve Property Listing?"
        message="Are you sure you want to approve this property? It will become publicly visible on the platform."
        confirmText="Approve Listing"
        isLoading={isApproving}
        onConfirm={handleConfirmApprove}
        onCancel={() => setApprovePropertyId(null)}
      />

      
      {selectedPropertyForReject && (
        <Modal
          isOpen={!!selectedPropertyForReject}
          onClose={() => setSelectedPropertyForReject(null)}
          title="Reject Property Listing"
        >
          <form onSubmit={handleRejectSubmit} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                Admin rejection feedback is <span className="font-extrabold">mandatory</span>. Please
                provide a clear explanation for the host owner.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Rejection Feedback for &ldquo;{selectedPropertyForReject.title}&rdquo;
              </label>
              <textarea
                rows={4}
                required
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="Specify missing requirements (e.g. low resolution photos, invalid location details, pricing out of range)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-600 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPropertyForReject(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                isLoading={isSubmittingRejection}
                isDisabled={!rejectionFeedback.trim()}
                icon={Send}
              >
                Confirm Rejection & Send Feedback
              </Button>
            </div>
          </form>
        </Modal>
      )}

     
      {editingProperty && (
        <Modal
          isOpen={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          title="Update Property Details"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Property Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => handleEditFormChange('title', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => handleEditFormChange('location', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rent (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.rent}
                  onChange={(e) => handleEditFormChange('rent', Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                <select
                  value={editForm.propertyType}
                  onChange={(e) => handleEditFormChange('propertyType', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Studio">Studio</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Condo">Condo</option>
                  <option value="Loft">Loft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.bedrooms}
                  onChange={(e) => handleEditFormChange('bedrooms', Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.bathrooms}
                  onChange={(e) => handleEditFormChange('bathrooms', Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Size (sqft)</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.propertySize}
                  onChange={(e) => handleEditFormChange('propertySize', Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingProperty(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isUpdating} icon={Pencil}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      
      <ConfirmDialog
        isOpen={!!deletePropertyId}
        title="Remove Listing Permanently?"
        message="Are you sure you want to permanently delete this property listing? This action cannot be undone."
        confirmText="Remove Listing"
        isDanger
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletePropertyId(null)}
      />
    </div>
  );
};

export default AdminProperties;
