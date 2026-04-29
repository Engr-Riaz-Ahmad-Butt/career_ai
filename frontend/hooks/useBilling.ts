import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { toast } from 'sonner';

export function useBilling() {
  const createCheckoutSession = useMutation({
    mutationFn: async ({ plan, successUrl, cancelUrl }: { plan: string; successUrl: string; cancelUrl: string }) => {
      const { data } = await apiClient.post('/billing/checkout', {
        plan,
        successUrl,
        cancelUrl,
      });
      return data.data;
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to initiate checkout');
    },
  });

  const createPortalSession = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/billing/portal');
      return data.data;
    },
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.location.href = data.portalUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to open billing portal');
    },
  });

  return {
    createCheckoutSession,
    createPortalSession,
    isLoading: createCheckoutSession.isPending || createPortalSession.isPending,
  };
}
