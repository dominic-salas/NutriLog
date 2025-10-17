'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [healthScore, setHealthScore] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const router = useRouter();
    const supabase = createClient();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        try {
            setUploading(true);

            // Get current user session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                throw new Error('Authentication required');
            }

            // Upload image to Supabase Storage
            const fileExt = selectedImage.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('meal-images')
                .upload(filePath, selectedImage);

            if (uploadError) {
                throw uploadError;
            }

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from('meal-images')
                .getPublicUrl(filePath);

            // Get current date and time
            const now = new Date();
            const date = now.toISOString().split('T')[0];
            const time = now.toTimeString().split(' ')[0];

            // Create meal entry - let Supabase generate the UUID
            const { data: insertData, error: insertError } = await supabase
                .from('meal_entries')
                .insert({
                    date: date,
                    time: time,
                    health_score: healthScore,
                    description: description,
                    user_id: session.user.id,
                    image_url: publicUrl
                })
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            console.log('Meal entry created:', insertData);

            // Redirect to profile page
            router.push('/profile');
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading image and saving meal entry. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-2xl font-bold text-white">Upload your meal photo</h1>

            <div className="bg-white/80 p-6 rounded-lg shadow-xl backdrop-blur-sm max-w-md w-full">
                <div className="flex flex-col gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                    />

                    {preview && (
                        <div className="relative w-full h-64 mt-4">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain rounded-lg"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-4 mt-4">
                        <Input
                            type="number"
                            placeholder="Health Score (0-100)"
                            min="0"
                            max="100"
                            value={healthScore}
                            onChange={(e) => setHealthScore(parseInt(e.target.value, 10))}
                            className="w-full"
                        />

                        <Input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="flex gap-4 justify-end mt-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/profile')}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedImage || uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}