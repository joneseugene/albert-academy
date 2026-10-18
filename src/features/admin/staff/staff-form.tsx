"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResourceFormProps } from "@/components/resource/types";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  createPhotoStorage,
  PHOTO_BUCKETS,
} from "@/lib/supabase/photo-storage";

import type { StaffResourceItem } from "./staff-resource";
import type { Staff } from "@/lib/repositories/staff.repository";
import type { StaffActionResult } from "@/lib/action/staff.action";
import { staffSchema, type StaffFormValues } from "@/lib/schemas/staff.schema";
import Image from "next/image";

export interface StaffFormActions {
  createAction: (input: StaffFormValues) => Promise<StaffActionResult<Staff>>;
  updateAction: (
    id: string,
    input: StaffFormValues,
  ) => Promise<StaffActionResult<Staff>>;
}

interface StaffFormProps
  extends ResourceFormProps<StaffResourceItem>,
    StaffFormActions {}

function getStoragePathFromPublicUrl(publicUrl: string, bucket: string): string | null {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.pathname.indexOf(marker);

    return index === -1
      ? null
      : decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

export function StaffForm({
  mode,
  row,
  onSuccess,
  createAction,
  updateAction,
}: StaffFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(row?.photo ?? null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formId = mode === "create" ? "staff-create-form" : "staff-edit-form";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: row?.name ?? "",
      photo: row?.photo ?? "",
      role: row?.role ?? "",
      level: row?.level ?? "",
      start_year: row?.start_year ?? null,
      end_year: row?.end_year ?? null,
    },
  });

  useEffect(() => {
    reset({
      name: row?.name ?? "",
      photo: row?.photo ?? "",
      role: row?.role ?? "",
      level: row?.level ?? "",
      start_year: row?.start_year ?? null,
      end_year: row?.end_year ?? null,
    });
    setPhotoFile(null);
    setPhotoPreview(row?.photo ?? null);
    setRemovePhoto(false);
    setSubmitError(null);
  }, [row, reset]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function handlePhotoChange(file: File | undefined) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"].includes(file.type)) {
      setSubmitError("Use JPEG, PNG, WebP, GIF, or AVIF.");
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setSubmitError("The image must be greater than 0 bytes and no larger than 5 MB.");
      return;
    }

    setSubmitError(null);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
  }

  async function onSubmit(values: StaffFormValues) {
    setSubmitError(null);

    const supabase = createSupabaseBrowserClient();
    const storage = createPhotoStorage(supabase);
    const bucket = PHOTO_BUCKETS.staff;

    let uploadedPath: string | null = null;
    const previousPhoto = row?.photo ?? null;
    let photo: string | null = removePhoto ? null : previousPhoto;

    try {
      if (photoFile) {
        const uploaded = await storage.upload(bucket, photoFile);
        photo = uploaded.publicUrl;
        uploadedPath = uploaded.path;
      }

      const payload: StaffFormValues = {
        name: values.name.trim(),
        photo: photo ?? "",
        role: values.role?.trim() ?? "",
        level: values.level?.trim() ?? "",
        start_year: values.start_year ?? null,
        end_year: values.end_year ?? null,
      };

      let result: StaffActionResult<Staff>;

      if (mode === "create") {
        result = await createAction(payload);
      } else {
        if (!row) throw new Error("The staff record could not be found.");
        result = await updateAction(row.id, payload);
      }

      if (!result.success) {
        throw new Error(result.message || "Unable to save the staff record.");
      }

      if (previousPhoto && previousPhoto !== photo) {
        const oldPath = getStoragePathFromPublicUrl(previousPhoto, bucket);
        if (oldPath) {
          try {
            await storage.remove(bucket, oldPath);
          } catch (error) {
            console.error("Unable to remove the previous staff photo:", error);
          }
        }
      }

      uploadedPath = null;
      await onSuccess();
    } catch (error) {
      if (uploadedPath) {
        try {
          await storage.remove(bucket, uploadedPath);
        } catch (cleanupError) {
          console.error("Unable to clean up the uploaded staff photo:", cleanupError);
        }
      }

      setSubmitError(
        error instanceof Error ? error.message : "Unable to save the staff record.",
      );
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor={`${formId}-name`}>Name *</Label>
        <Input id={`${formId}-name`} {...register("name")} placeholder="Enter staff member's name" disabled={isSubmitting} aria-invalid={!!errors.name} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-role`}>Role</Label>
        <Input id={`${formId}-role`} {...register("role")} placeholder="e.g. Principal" disabled={isSubmitting} aria-invalid={!!errors.role} />
        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-level`}>Level</Label>
        <Input id={`${formId}-level`} {...register("level")} placeholder="e.g. Senior Management" disabled={isSubmitting} aria-invalid={!!errors.level} />
        {errors.level && <p className="text-xs text-destructive">{errors.level.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${formId}-start-year`}>Start year</Label>
          <Input id={`${formId}-start-year`} type="number" {...register("start_year", { setValueAs: (value: string) => value === "" ? null : Number(value) })} placeholder="e.g. 2020" disabled={isSubmitting} aria-invalid={!!errors.start_year} />
          {errors.start_year && <p className="text-xs text-destructive">{errors.start_year.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-end-year`}>End year</Label>
          <Input id={`${formId}-end-year`} type="number" {...register("end_year", { setValueAs: (value: string) => value === "" ? null : Number(value) })} placeholder="Leave blank if current" disabled={isSubmitting} aria-invalid={!!errors.end_year} />
          {errors.end_year && <p className="text-xs text-destructive">{errors.end_year.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Photo</Label>
        {photoPreview && (
          <div className="flex items-center gap-4">
            <Image src={photoPreview} alt="Staff preview" className="size-20 rounded-lg border object-cover" />
            <Button type="button" variant="outline" size="sm" disabled={isSubmitting} onClick={() => { setPhotoFile(null); setPhotoPreview(null); setRemovePhoto(true); setSubmitError(null); }}>
              <X className="mr-2 size-4" /> Remove photo
            </Button>
          </div>
        )}
        <label htmlFor={`${formId}-photo`} className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center hover:bg-muted/50">
          <ImagePlus className="mb-2 size-6 text-muted-foreground" />
          <span className="text-sm font-medium">{photoPreview ? "Choose a different photo" : "Choose a photo"}</span>
          <span className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WebP, GIF or AVIF · Maximum 5 MB</span>
        </label>
        <input id={`${formId}-photo`} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="sr-only" disabled={isSubmitting} onChange={(event) => { handlePhotoChange(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} />
      </div>

      {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
    </form>
  );
}
