
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  School,
  Globe,
  MapPin,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { SchoolInfo } from "@/lib/repositories/school_info.repository";
import type { SchoolInfoFormValues} from "@/lib/schemas/school.info.schema";
import { emptySchoolInfo, schoolInfoSchema } from "@/lib/schemas/school.info.schema";
import { saveSchoolInfo } from "@/lib/action/school.info.action";

type Props = {
  initialData: SchoolInfo | null;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#7A1523] focus:ring-2 focus:ring-[#7A1523]/15";

const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700";

function toFormValues(
  record: SchoolInfo | null,
): SchoolInfoFormValues {
  if (!record) return { ...emptySchoolInfo };

  const contact =
    record.contact && typeof record.contact === "object"
      ? (record.contact as Record<string, unknown>)
      : {};

  const text = (value: unknown) =>
    typeof value === "string" ? value : "";

  return {
    name: record.name ?? "Albert Academy",
    about: record.about ?? "",
    vision: record.vision ?? "",
    mission: record.mission ?? "",
    history: record.history ?? "",
    founder: record.founder ?? "",
    contact: {
      address: text(contact.address),
      mobile_line_1: text(contact.mobile_line_1),
      mobile_line_2: text(contact.mobile_line_2),
      email: text(contact.email),
      po_box: text(contact.po_box),
      facebook_url: text(contact.facebook_url),
      youtube_url: text(contact.youtube_url),
      tweeter_url: text(contact.tweeter_url),
      tiktok_url: text(contact.tiktok_url),
    },
  };
}

export function SchoolInfoForm({ initialData }: Props) {
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SchoolInfoFormValues>({
    resolver: zodResolver(schoolInfoSchema),
    defaultValues: toFormValues(initialData),
  });

  useEffect(() => {
    reset(toFormValues(initialData));
  }, [initialData, reset]);

  async function onSubmit(values: SchoolInfoFormValues) {
    setFeedback(null);

    const result = await saveSchoolInfo(values);

    setFeedback(result);

    if (result.success) {
      reset(values);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function fieldError(message?: string) {
    if (!message) return null;

    return (
      <p className="mt-1 text-xs text-red-600">
        {message}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-start gap-3 rounded-lg border p-4 ${
            feedback.success
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
          )}
          <p className="text-sm">{feedback.message}</p>
        </div>
      )}

      {/* School identity */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <div className="rounded-lg bg-[#7A1523]/10 p-2 text-[#7A1523]">
            <School className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              School identity
            </h2>
            <p className="text-sm text-gray-500">
              The school&apos;s name and general information.
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          <div>
            <label className={labelClass} htmlFor="name">
              School name *
            </label>
            <input
              id="name"
              {...register("name")}
              className={inputClass}
              placeholder="Albert Academy"
            />
            {fieldError(errors.name?.message)}
          </div>

          <div>
            <label className={labelClass} htmlFor="founder">
              Founder
            </label>
            <input
              id="founder"
              {...register("founder")}
              className={inputClass}
              placeholder="Founder's name"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="about">
              About the school
            </label>
            <textarea
              id="about"
              {...register("about")}
              rows={5}
              className={inputClass}
              placeholder="Describe Albert Academy..."
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="vision">
              Vision
            </label>
            <textarea
              id="vision"
              {...register("vision")}
              rows={3}
              className={inputClass}
              placeholder="The school's vision..."
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="mission">
              Mission
            </label>
            <textarea
              id="mission"
              {...register("mission")}
              rows={3}
              className={inputClass}
              placeholder="The school's mission..."
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="history">
              School history
            </label>
            <textarea
              id="history"
              {...register("history")}
              rows={6}
              className={inputClass}
              placeholder="Enter the history of Albert Academy..."
            />
          </div>
        </div>
      </section>

      {/* Contact details */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <div className="rounded-lg bg-[#7A1523]/10 p-2 text-[#7A1523]">
            <MapPin className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Contact information
            </h2>
            <p className="text-sm text-gray-500">
              Public contact details for the school.
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="contact.address">
              Address
            </label>
            <input
              id="contact.address"
              {...register("contact.address")}
              className={inputClass}
              placeholder="School address"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="contact.mobile_line_1">
              Primary mobile number
            </label>
            <input
              id="contact.mobile_line_1"
              {...register("contact.mobile_line_1")}
              className={inputClass}
              placeholder="+232..."
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="contact.mobile_line_2">
              Secondary mobile number
            </label>
            <input
              id="contact.mobile_line_2"
              {...register("contact.mobile_line_2")}
              className={inputClass}
              placeholder="+232..."
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="contact.email">
              Email address
            </label>
            <input
              id="contact.email"
              type="email"
              {...register("contact.email")}
              className={inputClass}
              placeholder="info@example.com"
            />
            {fieldError(errors.contact?.email?.message)}
          </div>

          <div>
            <label className={labelClass} htmlFor="contact.po_box">
              P.O. Box
            </label>
            <input
              id="contact.po_box"
              {...register("contact.po_box")}
              className={inputClass}
              placeholder="Postal box"
            />
          </div>
        </div>
      </section>

      {/* Social links */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <div className="rounded-lg bg-[#7A1523]/10 p-2 text-[#7A1523]">
            <Globe className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Social media
            </h2>
            <p className="text-sm text-gray-500">
              Add the school&apos;s public social media URLs.
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          {(
            [
              ["facebook_url", "Facebook URL"],
              ["youtube_url", "YouTube URL"],
              ["tweeter_url", "Twitter / X URL"],
              ["tiktok_url", "TikTok URL"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label
                className={labelClass}
                htmlFor={`contact.${key}`}
              >
                {label}
              </label>
              <input
                id={`contact.${key}`}
                type="url"
                {...register(`contact.${key}`)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </section>

      {/* Save */}
      <div className="sticky bottom-0 z-10 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {isDirty
            ? "You have unsaved changes."
            : "All changes are saved."}
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7A1523] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#64111d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Save changes"
              : "Create school information"}
        </button>
      </div>
    </form>
  );
}
