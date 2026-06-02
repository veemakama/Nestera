"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { zodFormResolver } from "../lib/formResolver";
import { reportError, trackEvent } from "../lib/analytics";

export default function SupportPage() {
  const t = useTranslations("Support");
  const formsT = useTranslations("forms");

  const supportFormSchema = z.object({
    name: z.string().trim().min(2, t("validation.nameTooShort")),
    email: z.string().trim().min(1, formsT("required")).email(formsT("invalidEmail")),
    subject: z.string().trim().min(5, t("validation.subjectTooShort")),
    message: z.string().trim().min(10, t("validation.messageTooShort")),
  });
  type SupportFormValues = z.infer<typeof supportFormSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SupportFormValues>({
    resolver: zodFormResolver(supportFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: SupportFormValues) => {
    try {
      console.log("Support form submitted:", data);
      await Promise.resolve();
      trackEvent("form_submit_succeeded", { form: "support" });
      reset();
    } catch (error) {
      reportError(error, { form: "support" });
    }
  };

  return (
    <main className="min-h-screen bg-[#041c1e]">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          {t("Support.title")}
        </h1>
        
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#0A1A1A] rounded-2xl border border-white/10 p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="support-name" className="block text-[#8C9BAB] font-semibold mb-2 text-sm">
                {t("Support.nameLabel")}
              </label>
              <input
                type="text"
                id="support-name"
                {...register("name")}
                className={`w-full px-4 py-3 rounded-lg bg-[#0F2D2D] border border-white/10 text-[#8C9BAB] placeholder-[#6a8a93] focus:border-[#00D9C0] focus:outline-none transition-colors ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder={t("Support.namePlaceholder")}
                required
                aria-invalid={!!errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1" id="name-error">
                  {errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="support-email" className="block text-[#8C9BAB] font-semibold mb-2 text-sm">
                {t("Support.emailLabel")}
              </label>
              <input
                type="email"
                id="support-email"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-lg bg-[#0F2D2D] border border-white/10 text-[#8C9BAB] placeholder-[#6a8a93] focus:border-[#00D9C0] focus:outline-none transition-colors ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder={t("Support.emailPlaceholder")}
                required
                aria-invalid={!!errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1" id="email-error">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="support-subject" className="block text-[#8C9BAB] font-semibold mb-2 text-sm">
              {t("Support.subjectLabel")}
            </label>
            <input
              type="text"
              id="support-subject"
              {...register("subject")}
              className={`w-full px-4 py-3 rounded-lg bg-[#0F2D2D] border border-white/10 text-[#8C9BAB] placeholder-[#6a8a93] focus:border-[#00D9C0] focus:outline-none transition-colors ${
                errors.subject ? "border-red-500" : ""
              }`}
              placeholder={t("Support.subjectPlaceholder")}
              required
              aria-invalid={!!errors.subject ? "true" : "false"}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <p className="text-xs text-red-500 mt-1" id="subject-error">
                {errors.subject.message}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="support-message" className="block text-[#8C9BAB] font-semibold mb-2 text-sm">
              {t("Support.messageLabel")}
            </label>
            <textarea
              {...register("message")}
              id="support-message"
              rows={5}
              className={`w-full px-4 py-3 rounded-lg bg-[#0F2D2D] border border-white/10 text-[#8C9BAB] placeholder-[#6a8a93] focus:border-[#00D9C0] focus:outline-none transition-colors ${
                errors.message ? "border-red-500" : ""
              }`}
              placeholder={t("Support.messagePlaceholder")}
              required
              aria-invalid={!!errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p className="text-xs text-red-500 mt-1" id="message-error">
                {errors.message.message}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#00d1c1] text-[#020c0c] border-none rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("Support.sending") : t("Support.sendMessage")}
            </button>
          </div>
          
          {isSubmitSuccessful && (
            <div className="mt-4 p-4 bg-[#063d3d] border border-[#00d1c1] rounded-lg">
              <p className="text-xs text-green-500 text-center" role="status">
                {t("Support.success")}
              </p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
