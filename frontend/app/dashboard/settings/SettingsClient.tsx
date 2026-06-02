"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";

type Prefs = {
  emailNotifications?: boolean;
  inAppNotifications?: boolean;
  sweepNotifications?: boolean;
  claimNotifications?: boolean;
  yieldNotifications?: boolean;
  milestoneNotifications?: boolean;
};

export default function SettingsClient() {
  const t = useTranslations("Settings");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<Prefs>({
    defaultValues: {
      emailNotifications: false,
      inAppNotifications: false,
      sweepNotifications: false,
      claimNotifications: false,
      yieldNotifications: false,
      milestoneNotifications: false,
    },
  });

  const onSubmit = (data: Prefs) => {
    console.log("Settings submitted:", data);
    // Here you would typically send the data to your backend
    // For now, we'll just log it
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-linear-to-b from-[#063d3d] to-[#0a6f6f] flex items-center justify-center text-[#5de0e0]">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white m-0">{t("title")}</h1>
          <p className="text-[#5e8c96] text-sm m-0">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="bg-linear-to-b from-[rgba(6,18,20,0.45)] to-[rgba(4,12,14,0.35)] border border-[rgba(8,120,120,0.06)] rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-white mb-4">{t("notifications")}</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-left max-w-xl mx-auto"
          aria-describedby={isSubmitSuccessful ? "settings-success" : undefined}
        >
          <label className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">{t("emailNotifications")}</div>
              <div className="text-sm text-[#5e8c96]">
                {t("emailNotificationsDescription")}
              </div>
            </div>
            <input
              type="checkbox"
              {...register("emailNotifications")}
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">{t("inAppNotifications")}</div>
              <div className="text-sm text-[#5e8c96]">
                {t("inAppNotificationsDescription")}
              </div>
            </div>
            <input
              type="checkbox"
              {...register("inAppNotifications")}
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">
                {t("sweepNotifications")}
              </div>
              <div className="text-sm text-[#5e8c96]">
                {t("sweepNotificationsDescription")}
              </div>
            </div>
            <input
              type="checkbox"
              {...register("sweepNotifications")}
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">
                {t("claimNotifications")}
              </div>
              <div className="text-sm text-[#5e8c96]">
                {t("claimNotificationsDescription")}
              </div>
            </div>
            <input
              type="checkbox"
              {...register("claimNotifications")}
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">
                {t("yieldNotifications")}
              </div>
              <div className="text-sm text-[#5e8c96]">
                {t("yieldNotificationsDescription")}
              </div>
            </div>
            <input
              type="checkbox"
              {...register("yieldNotifications")}
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">
                {t("milestoneNotifications")}
              </div>
              <div className="text-sm text-[#5e8c96]">
                {t("milestoneNotificationsDescription")}
              </div>
            </div>
            <input
              type="checkbox"
              {...register("milestoneNotifications")}
            />
          </label>

          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#06b6b6] text-black font-semibold disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("saving") : t("save")}
            </button>
          </div>
          
          {isSubmitSuccessful && (
            <p id="settings-success" role="status" className="mt-4 text-xs text-green-500 text-center">
              {t("success")}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
