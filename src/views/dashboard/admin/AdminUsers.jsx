'use client';

import React, { useState } from 'react';
import { Search, Shield, User, Mail, Calendar } from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorState from '../../../components/common/ErrorState';
import EmptyState from '../../../components/common/EmptyState';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { useAdminUsers, changeUserRole } from '../../../api/adminService';
import { formatDate } from '../../../utils/formatters';
import { showToast } from '../../../utils/toast';

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: users = [], isLoading, isError, refetch } = useAdminUsers();

  const [updatingId, setUpdatingId] = useState(null);
  const [pendingRoleChange, setPendingRoleChange] = useState(null); 

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <LoadingSpinner size="lg" text="Loading platform user accounts..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load users"
        description="Could not retrieve platform users from the server."
        onRetry={refetch}
      />
    );
  }

  const handleConfirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    const { user: targetUser, targetRole } = pendingRoleChange;
    setUpdatingId(targetUser.id);

    try {
      await changeUserRole(targetUser.id, targetRole.toLowerCase());
      refetch();
      showToast.success(`Updated role for ${targetUser.name} to "${targetRole.toUpperCase()}"!`);
      setPendingRoleChange(null);
    } catch (err) {
      showToast.error('Failed to change user role. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const tableHeaders = ['User Profile', 'Email Address', 'Current Role', 'Created Date', 'Action: Change Role'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle
          badge="User Directory"
          title="All Platform Users"
          subtitle="View registered accounts, filter user records, and update access permissions."
        />

      
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState title="No matching user accounts found" description="Try adjusting your search criteria." />
      ) : (
        <>
         
          <div className="hidden md:block">
            <Table headers={tableHeaders}>
              {paginatedUsers.map((usr) => (
                <TableRow key={usr.id}>
                
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {usr.image ? (
                        <img
                          src={usr.image}
                          alt={usr.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
                          {usr.name ? usr.name[0].toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {usr.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                 
                  <TableCell className="text-xs text-slate-600 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {usr.email}
                    </span>
                  </TableCell>

                 
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                        (usr.role || '').toLowerCase() === 'admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : (usr.role || '').toLowerCase() === 'owner' || (usr.role || '').toLowerCase() === 'host'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {usr.role}
                    </span>
                  </TableCell>

                  
                  <TableCell className="text-xs text-slate-700 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(usr.createdAt)}
                    </span>
                  </TableCell>

                 
                  <TableCell align="right">
                    <select
                      value={(usr.role || 'tenant').toLowerCase()}
                      disabled={updatingId === usr.id}
                      onChange={(e) => setPendingRoleChange({ user: usr, targetRole: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer disabled:opacity-50"
                    >
                      <option value="tenant">tenant</option>
                      <option value="owner">owner</option>
                      <option value="admin">admin</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          
          <div className="md:hidden space-y-4">
            {paginatedUsers.map((usr) => (
              <div key={usr.id} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {usr.image ? (
                      <img src={usr.image} alt={usr.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {usr.name ? usr.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{usr.name}</h4>
                      <p className="text-xs text-slate-500 font-bold">{usr.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    {usr.role}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500 font-bold">Joined: {formatDate(usr.createdAt)}</span>
                  <select
                    value={(usr.role || 'tenant').toLowerCase()}
                    disabled={updatingId === usr.id}
                    onChange={(e) => setPendingRoleChange({ user: usr, targetRole: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                  >
                    <option value="tenant">tenant</option>
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            limit={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      
      <ConfirmDialog
        isOpen={!!pendingRoleChange}
        title="Confirm User Role Modification?"
        message={`Are you sure you want to change ${pendingRoleChange?.user?.name}'s role from "${pendingRoleChange?.user?.role}" to "${pendingRoleChange?.targetRole?.toUpperCase()}"?`}
        confirmText="Confirm Role Change"
        isDanger={pendingRoleChange?.targetRole === 'admin'}
        isLoading={!!updatingId}
        onConfirm={handleConfirmRoleChange}
        onCancel={() => setPendingRoleChange(null)}
      />
    </div>
  );
};

export default AdminUsers;
