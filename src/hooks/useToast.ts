import { toast } from "sonner";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const showSuccess = (options: ToastOptions) => {
    toast.success(options.title, {
      description: options.description,
      duration: options.duration || 3000,
    });
  };

  const showError = (options: ToastOptions) => {
    toast.error(options.title, {
      description: options.description,
      duration: options.duration || 5000,
    });
  };

  const showWarning = (options: ToastOptions) => {
    toast.warning(options.title, {
      description: options.description,
      duration: options.duration || 4000,
    });
  };

  const showInfo = (options: ToastOptions) => {
    toast.info(options.title, {
      description: options.description,
      duration: options.duration || 3000,
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    dismiss,
  };
}
