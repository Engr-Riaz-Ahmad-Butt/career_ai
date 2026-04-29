import OnboardingLayout from '@/components/onboarding/OnboardingLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}
