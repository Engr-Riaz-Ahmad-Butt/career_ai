'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { billingApi } from '@/lib/api/billing';
import { Check, Loader2 } from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: billingApi.getPlans,
  });

  const plans = plansData?.data?.plans || [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started',
      features: ['1 Resume', '5 AI Tailors/month', 'Basic ATS Check', 'Interview Q&A'],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro Monthly',
      price: 9.99,
      period: 'month',
      description: 'For active job seekers',
      features: ['Unlimited Resumes', 'Unlimited AI Tailors', 'Advanced ATS Analysis', 'Cover Letter Generator', 'Interview Video Practice', 'Priority Support'],
      cta: 'Upgrade Now',
      highlighted: true,
    },
    {
      name: 'Pro Annual',
      price: 99,
      period: 'year',
      description: 'Save 2 months with annual plan',
      features: ['Everything in Pro Monthly', '2 months free', 'Custom Resume Templates', 'Team Collaboration', 'Advanced Analytics', '24/7 Support'],
      cta: 'Upgrade Now',
      highlighted: false,
    },
    {
      name: 'Team',
      price: 0,
      period: '',
      description: 'For organizations',
      features: ['Everything in Pro Annual', 'Unlimited Users', 'Team Dashboard', 'Compliance Reports', 'Dedicated Account Manager'],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Choose the perfect plan to accelerate your career growth
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200 dark:bg-slate-800"
              >
                <motion.span
                  layout
                  className="inline-block h-6 w-6 transform rounded-full bg-white dark:bg-slate-950 shadow-lg"
                  initial={false}
                  animate={{ x: isAnnual ? 28 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                Annual
                <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-4 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {plans.map((tier: any, index: number) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`rounded-lg border transition-all ${tier.highlighted
                  ? 'border-indigo-600 dark:border-indigo-500 shadow-xl scale-105 md:scale-100 lg:scale-105'
                  : 'border-slate-200 dark:border-slate-800'
                  } overflow-hidden flex flex-col`}
              >
                {/* Header */}
                <div className={`p-6 ${tier.highlighted ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' : 'bg-slate-50 dark:bg-slate-900'}`}>
                  {tier.highlighted && (
                    <div className="mb-2 inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className={`text-sm ${tier.highlighted ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                    {tier.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className={`p-6 border-b ${tier.highlighted ? 'border-indigo-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      ${isAnnual && tier.price > 0 && tier.name !== 'Team' ? Math.floor(tier.price * 12 * 0.83) : tier.price}
                    </span>
                    {tier.price > 0 && (
                      <span className={`text-sm ml-2 ${tier.highlighted ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                        /{isAnnual && tier.price > 0 && tier.name !== 'Team' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {tier.price === 0 && tier.period && (
                    <p className={`text-sm ${tier.highlighted ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      {tier.period}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="p-6 space-y-4 flex-1">
                  {tier.features.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${tier.highlighted ? 'text-indigo-200' : 'text-emerald-500'}`} />
                      <span className={`text-sm ${tier.highlighted ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="p-6 border-t">
                  <Link href={tier.name === 'Team' ? '#contact-sales' : '/register'}>
                    <Button
                      className={`w-full ${tier.highlighted
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                        }`}
                    >
                      {tier.cta || 'Get Started'}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {[
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! The Free plan gives you full access to our core features with no credit card required.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
              },
              {
                q: 'Do you offer refunds?',
                a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {item.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
