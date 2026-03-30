import { toast } from '@/components/ui/toast';

export function useToast() {
  return {
    toast,
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
  };
}
