"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { CircleHelp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/Modal";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/client";

interface SupportButtonProps {
  userId: string;
}

const INITIAL_FORM = {
  altEmail: "",
  subject: "",
  description: "",
};

export function SupportButton({ userId }: SupportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ subject: string; description: string } | null>(null);

  const supabase = createClient();

  const openModal = () => {
    setIsModalOpen(true);
    setError(null);
    setSubmittedData(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setIsSubmitting(false);
    setFormData(INITIAL_FORM);
    setSubmittedData(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError("Subject and description are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("feedback").insert({
      user_id: userId,
      alt_email: formData.altEmail || null,
      subject: formData.subject.trim(),
      description: formData.description.trim(),
    });

    if (insertError) {
      console.error("Failed to send feedback", insertError);
      setError("We couldn't send your feedback. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmittedData({
      subject: formData.subject.trim(),
      description: formData.description.trim(),
    });
    setFormData(INITIAL_FORM);
    setIsSubmitting(false);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="alt-email" className="text-white/85">
          Alternate Email
        </Label>
        <Input
          id="alt-email"
          type="email"
          value={formData.altEmail}
          onChange={(event) => setFormData((prev) => ({ ...prev, altEmail: event.target.value }))}
          disabled={isSubmitting}
          className="h-11 rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/55"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="support-subject" className="text-white/85">
          Subject
        </Label>
        <Input
          id="support-subject"
          value={formData.subject}
          onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
          disabled={isSubmitting}
          className="h-11 rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/55"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="support-description" className="text-white/85">
          Description
        </Label>
        <textarea
          id="support-description"
          value={formData.description}
          onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          disabled={isSubmitting}
          rows={4}
          className="w-full rounded-xl border border-white/15 bg-white/10 p-3 text-sm text-white placeholder:text-white/55 focus:border-white/40 focus:bg-white/15"
          required
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          onClick={closeModal}
          className="h-11 rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/15"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-xl border-0 bg-gradient-to-r from-lime-400/85 to-emerald-500/85 font-semibold text-white hover:from-lime-400 hover:to-emerald-500 disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </Button>
      </div>
    </form>
  );

  const renderSuccess = () => {
    const thankYouMessage = `Subject: ${submittedData?.subject ?? ""}\nDescription: ${submittedData?.description ?? ""}`;

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/85">
          <p className="whitespace-pre-line">{thankYouMessage}</p>
        </div>
        <Button
          type="button"
          onClick={closeModal}
          className="h-11 w-full rounded-xl border-0 bg-gradient-to-r from-lime-400/85 to-emerald-500/85 font-semibold text-white hover:from-lime-400 hover:to-emerald-500"
        >
          Proceed
        </Button>
      </div>
    );
  };

  return (
    <>
      <Button
        type="button"
        onClick={openModal}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/20 backdrop-blur-2xl"
      >
        Support
        <CircleHelp className="h-4 w-4" />
      </Button>

      <Modal open={isModalOpen} onClose={closeModal}>
        <GlassCard className="relative w-full max-w-lg overflow-hidden text-white">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/25 via-transparent to-white/10 opacity-60" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-center text-2xl font-bold">Send Feedback</h2>
            <p className="text-center text-sm text-white/75">
              Let our team know what would make CalorieScan better.
            </p>
            {submittedData ? renderSuccess() : renderForm()}
          </div>
        </GlassCard>
      </Modal>
    </>
  );
}
