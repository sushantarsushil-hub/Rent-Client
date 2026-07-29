import Swal from 'sweetalert2';
import toast from 'react-hot-toast';



export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#ffffff',
        fontWeight: '500',
        borderRadius: '10px',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#10b981',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#ffffff',
        fontWeight: '500',
        borderRadius: '10px',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#ef4444',
      },
    });
  },

  info: (message) => {
    toast(message, {
      duration: 3500,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#ffffff',
        fontWeight: '500',
        borderRadius: '10px',
      },
    });
  },
};


export const showConfirmModal = async ({
  title = 'Are you sure?',
  text = "You won't be able to revert this!",
  confirmButtonText = 'Yes, proceed!',
  cancelButtonText = 'Cancel',
  icon = 'warning',
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#64748b',
    confirmButtonText,
    cancelButtonText,
    customClass: {
      popup: 'rounded-2xl shadow-xl border border-base-300 bg-base-100 text-base-content',
      title: 'text-xl font-bold',
      confirmButton: 'px-5 py-2.5 rounded-xl font-medium',
      cancelButton: 'px-5 py-2.5 rounded-xl font-medium',
    },
  });

  return result.isConfirmed;
};
