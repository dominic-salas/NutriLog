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

            if (modalData.newPassword !== modalData.confirmPassword) throw new Error('New passwords do not match');

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({ password: modalData.newPassword });
            if (updateError) throw updateError;

            setModalSuccess(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setModalSuccess(false);
                setModalData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }, 3000);
        } catch (err: any) {
            setModalError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div>
            <div className="w-full max-w-lg rounded-3xl bg-white/80 p-10 shadow-2xl backdrop-blur-md">
                    {/* header */}
                    <div className="mb-6 flex items-center justify-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Utensils className="h-4 w-4" />
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-gray-900">
                            NutriLog
                        </span>
                    </div>

                    {/* profile content */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
                        <p className="mt-2 text-sm text-gray-600">Update your information below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                                Profile updated successfully!
                            </div>
                        )}
                        <div>
                            <Label htmlFor="email" className="text-gray-900">Email</Label>
                            <Input
                                id="email"
                                value={profile.email}
                                disabled
                                className="text-gray-900 bg-gray-100"
                            />
                        </div>
                        <div>
                            <Label htmlFor="first-name" className="text-gray-900">First Name</Label>
                            <Input
                                id="first-name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                disabled={isLoading}
                                className="text-gray-900 bg-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="last-name" className="text-gray-900">Last Name</Label>
                            <Input
                                id="last-name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                disabled={isLoading}
                                className="text-gray-900 bg-white"
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="w-full text-gray-900 bg-gray-200 hover:bg-gray-300"
                        >
                            Change Password
                        </Button>
                        <Button type="submit" disabled={isLoading} className="w-full text-gray-900 bg-gray-200 hover:bg-gray-300">
                            {isLoading ? 'Updating...' : 'Update Profile'}
                        </Button>
                    </form>
                </div>

                {/* change password modal */}
                {isModalOpen && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center px-4">
                        <div className="w-full max-w-lg rounded-3xl bg-white/80 p-10 shadow-2xl backdrop-blur-md">
                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Change Password</h2>
                            <form onSubmit={handleModalSubmit} className="space-y-4">
                                {modalError && (
                                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                        {modalError}
                                    </div>
                                )}
                                {modalSuccess && (
                                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                                        Password changed successfully!
                                    </div>
                                )}
                                <div>
                                    <Label htmlFor="current-password" className="text-gray-900">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={modalData.currentPassword}
                                        onChange={(e) => setModalData({ ...modalData, currentPassword: e.target.value })}
                                        disabled={modalLoading}
                                        className="text-gray-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="new-password" className="text-gray-900">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={modalData.newPassword}
                                        onChange={(e) => setModalData({ ...modalData, newPassword: e.target.value })}
                                        disabled={modalLoading}
                                        className="text-gray-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="confirm-password" className="text-gray-900">Confirm New Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={modalData.confirmPassword}
                                        onChange={(e) => setModalData({ ...modalData, confirmPassword: e.target.value })}
                                        disabled={modalLoading}
                                        className="text-gray-900 bg-white"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 text-gray-900 bg-gray-200 hover:bg-gray-300">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={modalLoading} className="flex-1 text-gray-900 bg-gray-200 hover:bg-gray-300">
                                        {modalLoading ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }