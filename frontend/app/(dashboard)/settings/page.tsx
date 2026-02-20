'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { User, Lock, Bell, Zap } from 'lucide-react';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
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
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-slate-200 dark:border-slate-800 bg-transparent p-0 h-auto">
              <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="billing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600">
                <Zap className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Profile Information
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      defaultValue={user?.name}
                      className="bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      defaultValue={user?.email}
                      className="bg-slate-50 dark:bg-slate-900"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <textarea
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Password
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  Update Password
                </Button>
              </div>

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
                    {user?.plan === 'free' ? 'Free Plan' : 'Pro Plan'}
                  </p>
                  <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-4">
                    {user?.plan === 'free'
                      ? 'Limited to 1 resume and 5 tailors per month'
                      : 'Unlimited resumes and tailors with priority support'}
                  </p>
                  {user?.plan === 'free' && (
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
                  <AlertDialogTrigger asChild>
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
                      <AlertDialogAction onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700">
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
  );
}
