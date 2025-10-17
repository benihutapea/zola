import { toast } from "sonner";

/**
 * Toast notifications for the creative components
 * Using sonner toast library that's already configured in the app
 */

export const CreativeToast = {
  /**
   * Show a success toast notification
   */
  success: (message: string) => {
    toast.success(message, {
      position: "top-center",
      duration: 3000,
    });
  },

  /**
   * Show an error toast notification
   */
  error: (message: string, details?: string) => {
    toast.error(message, {
      position: "top-center",
      duration: 5000,
      description: details,
      action: {
        label: "Dismiss",
        onClick: () => {},
      },
    });
  },

  /**
   * Show an info toast notification
   */
  info: (message: string) => {
    toast.info(message, {
      position: "top-center",
      duration: 3000,
    });
  },

  /**
   * Show a warning toast notification
   */
  warning: (message: string, details?: string) => {
    toast.warning(message, {
      position: "top-center",
      duration: 4000,
      description: details,
    });
  },

  /**
   * Show a loading toast notification
   * Returns a loading toast ID that can be used to dismiss the toast
   */
  loading: (message: string) => {
    return toast.loading(message, {
      position: "top-center",
    });
  },

  /**
   * Dismiss a loading toast notification
   */
  dismiss: (id: string | number) => {
    toast.dismiss(id);
  },
};