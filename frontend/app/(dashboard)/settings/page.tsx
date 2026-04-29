'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { message } from 'antd';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock, Bell, Zap, CheckCircle2, Share2, Copy, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FeatureErrorBoundary } from '@/components/errors/FeatureErrorBoundary';
import apiClient from '@/lib/api/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { usePasswordChangeMutation, useProfileUpdateMutation } from '@/hooks/useAccountSettings';
import { updateProfileSchema, changePasswordSchema } from '@/lib/validation';
import { useAuthStore, type User as AuthUser } from '@/store/authStore';



type ProfileData = z.infer<typeof updateProfileSchema>;
type PasswordData = z.infer<typeof changePasswordSchema>;

function ProfileTab({ user, onUpdate }: { user: AuthUser | null; onUpdate: (data: AuthUser) => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const updateProfileMutation = useProfileUpdateMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (values: ProfileData) => {
    setIsSaving(true);
    try {
      const profile = await updateProfileMutation.mutateAsync(values);
      onUpdate(profile as AuthUser);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Profile Information
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              {...register('fullName')}
              className={`bg-slate-50 dark:bg-slate-900 ${errors.fullName ? 'border-rose-500' : ''}`}
            />
            {errors.fullName && <p className="text-[10px] text-rose-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              defaultValue={user?.email}
              className="bg-slate-50 dark:bg-slate-900"
              disabled
            />
            <p className="text-[10px] text-slate-400">Email cannot be changed contact support.</p>
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
              className="bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <textarea
              {...register('bio')}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              rows={4}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="bg-gradient-to-r from-indigo-600 to-teal-600"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}

function SecurityTab() {
  const [isLoading, setIsLoading] = useState(false);
  const changePasswordMutation = usePasswordChangeMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: PasswordData) => {
    setIsLoading(true);
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password changed successfully');
      reset();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Password
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('currentPassword')}
              className={`bg-slate-50 dark:bg-slate-900 ${errors.currentPassword ? 'border-rose-500' : ''}`}
            />
            {errors.currentPassword && <p className="text-[10px] text-rose-500">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('newPassword')}
              className={`bg-slate-50 dark:bg-slate-900 ${errors.newPassword ? 'border-rose-500' : ''}`}
            />
            {errors.newPassword && <p className="text-[10px] text-rose-500">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`bg-slate-50 dark:bg-slate-900 ${errors.confirmPassword ? 'border-rose-500' : ''}`}
            />
            {errors.confirmPassword && <p className="text-[10px] text-rose-500">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-teal-600">
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
          Two-Factor Authentication
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Add an extra layer of security to your account
        </p>
        <Button variant="outline">
          Enable 2FA
        </Button>
      </div>
    </div>
  );
}

function ReferralTab({ user }: { user: AuthUser | null }) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const { data } = await apiClient.get('/user/me/referrals');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch referrals:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const referralLink = user?.referralCode 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/register?ref=${user.referralCode}`
    : '';

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      message.success('Referral link copied!');
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-indigo-600" />
          Invite Friends, Earn Credits
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Share your referral link with friends. When they sign up, you both get 5 free credits!
        </p>

        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="flex-1 text-sm font-mono text-slate-600 dark:text-slate-400 truncate pl-2">
            {referralLink || 'Generating link...'}
          </span>
          <Button 
            size="sm" 
            onClick={handleCopy}
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[80px]"
          >
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <><Copy className="h-4 w-4 mr-2" /> Copy</>}
          </Button>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Your Referral Stats</h3>
        
        {isLoading ? (
          <div className="animate-pulse flex gap-4">
            <div className="h-24 flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            <div className="h-24 flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center justify-center text-center">
              <Users className="h-8 w-8 text-indigo-600 mb-2" />
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalReferrals || 0}</span>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mt-1">Friends Joined</span>
            </div>
            
            <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 flex flex-col items-center justify-center text-center">
              <Zap className="h-8 w-8 text-teal-600 mb-2" />
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.creditsEarned || 0}</span>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest mt-1">Credits Earned</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } finally {
      router.push('/auth/login');
    }
  };

  return (
    <FeatureErrorBoundary featureName="Settings">
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5 rounded-none border-b border-slate-200 dark:border-slate-800 bg-transparent p-0 h-auto">
              <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600">
                <UserIcon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600">
                <Lock className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600">
                <Share2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Referrals</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600">
                <Bell className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600">
                <Zap className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab user={user} onUpdate={(updatedUser) => setUser(updatedUser)} />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>

            <TabsContent value="referrals">
              <ReferralTab user={user} />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Email Notifications
                </h3>

                <div className="space-y-3">
                  {[
                    { label: 'Resume Updates', description: 'Get notified when your resume is optimized' },
                    { label: 'Job Recommendations', description: 'Receive personalized job recommendations' },
                    { label: 'Interview Tips', description: 'Get tips and reminders for upcoming interviews' },
                    { label: 'Weekly Digest', description: 'Receive a weekly digest of your progress' },
                  ].map((notif) => (
                    <div
                      key={notif.label}
                      className="flex items-start justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {notif.label}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {notif.description}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Current Plan
                </h3>

                <div className="p-4 rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/10">
                  <p className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                    {user?.plan === 'FREE' ? 'Free Plan' : 'Pro Plan'}
                  </p>
                  <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-4">
                    {user?.plan === 'FREE'
                      ? 'Limited to 1 resume and 5 tailors per month'
                      : 'Unlimited resumes and tailors with priority support'}
                  </p>
                  {user?.plan === 'FREE' && (
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Upgrade to Pro
                    </Button>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Danger Zone
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Logging out will end your current session. You'll need to sign in again.
                </p>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="destructive">
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be logged out of your account. You can sign in again anytime.
                    </AlertDialogDescription>
                    <div className="flex gap-2 justify-end">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>
                        Logout
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        </div>
      </div>
    </FeatureErrorBoundary>
  );
}
