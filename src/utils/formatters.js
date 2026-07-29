
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
    case 'active':
    case 'available':
    case 'completed':
      return 'badge badge-success gap-1 font-medium text-white';
    case 'pending':
      return 'badge badge-warning gap-1 font-medium text-white';
    case 'cancelled':
    case 'rejected':
    case 'unavailable':
      return 'badge badge-error gap-1 font-medium text-white';
    default:
      return 'badge badge-ghost gap-1 font-medium';
  }
};
