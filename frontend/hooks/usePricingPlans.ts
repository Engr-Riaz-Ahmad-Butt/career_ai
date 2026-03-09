import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { billingApi } from '@/lib/api/endpoints/billing.api';
import { queryKeys } from '@/lib/query-keys';

export interface PricingPlanView {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly period: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly highlighted: boolean;
}

const DEFAULT_PLANS: readonly PricingPlanView[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: ['1 Resume', '5 AI Tailors/month', 'Basic ATS Check', 'Interview Q&A'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: 9.99,
    period: 'month',
    description: 'For active job seekers',
    features: [
      'Unlimited Resumes',
      'Unlimited AI Tailors',
      'Advanced ATS Analysis',
      'Cover Letter Generator',
      'Interview Video Practice',
      'Priority Support',
    ],
    cta: 'Upgrade Now',
    highlighted: true,
  },
  {
    id: 'pro-annual',
    name: 'Pro Annual',
    price: 99,
    period: 'year',
    description: 'Save 2 months with annual plan',
    features: [
      'Everything in Pro Monthly',
      '2 months free',
      'Custom Resume Templates',
      'Team Collaboration',
      'Advanced Analytics',
      '24/7 Support',
    ],
    cta: 'Upgrade Now',
    highlighted: false,
  },
  {
    id: 'team',
    name: 'Team',
    price: 0,
    period: '',
    description: 'For organizations',
    features: [
      'Everything in Pro Annual',
      'Unlimited Users',
      'Team Dashboard',
      'Compliance Reports',
      'Dedicated Account Manager',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
] as const;

function toPricingPlanView(plan: {
  id: string;
  name: string;
  price: number;
  billingInterval: string;
  features: string[];
}): PricingPlanView {
  const normalizedPlanId = plan.id.toUpperCase();

  return {
    id: normalizedPlanId.toLowerCase(),
    name: plan.name,
    price: plan.price,
    period: plan.billingInterval,
    description: '',
    features: plan.features,
    cta: normalizedPlanId === 'FREE' ? 'Get Started' : normalizedPlanId === 'TEAM' || normalizedPlanId === 'ENTERPRISE' ? 'Contact Sales' : 'Upgrade Now',
    highlighted: normalizedPlanId === 'PRO',
  };
}

export function usePricingPlans(): {
  readonly plans: readonly PricingPlanView[];
  readonly isLoading: boolean;
} {
  const plansQuery = useQuery({
    queryKey: queryKeys.billing.plans(),
    queryFn: billingApi.getPlans,
  });

  const plans = useMemo(() => {
    if (!plansQuery.data || plansQuery.data.length === 0) {
      return DEFAULT_PLANS;
    }

    return plansQuery.data.map(toPricingPlanView);
  }, [plansQuery.data]);

  return {
    plans,
    isLoading: plansQuery.isLoading,
  };
}
