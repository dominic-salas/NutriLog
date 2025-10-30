"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Utensils } from "lucide-react";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [formData, setFormData] = useState(profile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: formData.first_name,
                last_name: formData.last_name,
            })
            .eq('id', profile.id);

        setIsLoading(false);

        if (error) {
            setError('Failed to update profile. Please try again.');
            console.error(error);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    setModalSuccess(false);

    try {
        // Re-authenticate with current password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: modalData.currentPassword,
      });
      if (authError) throw new Error('Current password is incorrect');

      if (modalData.newPassword !== modalData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: modalData.newPassword,
      });
      if (updateError) throw updateError;

      setModalSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setModalSuccess(false);
        setModalData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }, 1500);
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-lg">
      <div className="relative rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/25 via-transparent to-white/10 opacity-60" />
        {/* header */}
        <div className="relative z-10 mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <Utensils className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">NutriLog</span>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="mt-2 text-sm text-white/75">Update your information below</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
              Profile updated successfully!
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/85">
              Email
            </Label>
            <Input
              id="email"
              value={profile.email}
              disabled
              className="h-11 rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/55 disabled:opacity-70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="first-name" className="text-white/85">
              First Name
            </Label>
            <Input
              id="first-name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              disabled={isLoading}
              className="h-11 rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name" className="text-white/85">
              Last Name
            </Label>
            <Input
              id="last-name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              disabled={isLoading}
              className="h-11 rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="h-11 rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/15"
            >
              Change Password
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 rounded-xl border-0 bg-gradient-to-r from-lime-400/85 to-emerald-500/85 font-semibold text-white hover:from-lime-400 hover:to-emerald-500 disabled:opacity-70"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>

      {/* change password modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/25 via-transparent to-white/10 opacity-60" />
            <h2 className="relative z-10 mb-4 text-center text-2xl font-bold">
              Change Password
            </h2>

            <form onSubmit={handleModalSubmit} className="relative z-10 space-y-4">
              {modalError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {modalError}
                </div>
              )}
              {modalSuccess && (
                <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
                  Password changed successfully!
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white/85">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={modalData.currentPassword}
                  onChange={(e) =>
                    setModalData({ ...modalData, currentPassword: e.target.value })
                  }
                  disabled={modalLoading}
                  className="h-11 rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/55"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white/85">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={modalData.newPassword}
                  onChange={(e) =>
                    setModalData({ ...modalData, newPassword: e.target.value })
                  }
                  disabled={modalLoading}
                  className="h-11 rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/55"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white/85">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={modalData.confirmPassword}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      confirmPassword: e.target.value,
                    })
                  }
                  disabled={modalLoading}
                  className="h-11 rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/55"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/15"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={modalLoading}
                  className="h-11 rounded-xl border-0 bg-gradient-to-r from-lime-400/85 to-emerald-500/85 font-semibold text-white hover:from-lime-400 hover:to-emerald-500 disabled:opacity-70"
                >
                  {modalLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}