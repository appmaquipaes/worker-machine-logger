
import React from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  loading: Loader2
};

export const enhancedToast = {
  success: (message: string, options?: ToastOptions) => {
    const Icon = toastIcons.success;
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <Icon className="h-4 w-4 text-green-600" />,
      className: 'border-green-200 bg-green-50',
      ...options
    });
  },

  error: (message: string, options?: ToastOptions) => {
    const Icon = toastIcons.error;
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      icon: <Icon className="h-4 w-4 text-red-600" />,
      className: 'border-red-200 bg-red-50',
      ...options
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    const Icon = toastIcons.warning;
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <Icon className="h-4 w-4 text-yellow-600" />,
      className: 'border-yellow-200 bg-yellow-50',
      ...options
    });
  },

  info: (message: string, options?: ToastOptions) => {
    const Icon = toastIcons.info;
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <Icon className="h-4 w-4 text-blue-600" />,
      className: 'border-blue-200 bg-blue-50',
      ...options
    });
  },

  loading: (message: string, options?: ToastOptions) => {
    const Icon = toastIcons.loading;
    return toast.loading(message, {
      description: options?.description,
      icon: <Icon className="h-4 w-4 text-gray-600 animate-spin" />,
      className: 'border-gray-200 bg-gray-50',
      ...options
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });
  }
};
