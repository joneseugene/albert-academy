
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
import type { AcademicResourceItem } from "./academic-resource";
import type { Academic } from "@/lib/repositories/academic.repository";
import type { AcademicActionResult } from "@/lib/action/academic.action";
import {
  academicSchema,
  type AcademicFormValues,
} from "@/lib/schemas/academic.schema";
import Image from "next/image";

export interface AcademicFormActions {
  createAction: (
    input: AcademicFormValues,
  ) => Promise<AcademicActionResult<Academic>>;

  updateAction: (
    id: string,
    input: AcademicFormValues,
  ) => Promise<AcademicActionResult<Academic>>;
}

interface AcademicFormProps
  extends ResourceFormProps<AcademicResourceItem>,
    AcademicFormActions {}

function getStoragePathFromPublicUrl(
  publicUrl: string,
  bucket: string,
): string | null {
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

export function AcademicForm({
  mode,
  row,
  onSuccess,
  createAction,
  updateAction,
}: AcademicFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    row?.photo ?? null,
  );
  const [removePhoto, setRemovePhoto] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formId =
    mode === "create" ? "academic-create-form" : "academic-edit-form";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AcademicFormValues>({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      name: row?.name ?? "",
      photo: row?.photo ?? "",
      link: row?.link ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: row?.name ?? "",
      photo: row?.photo ?? "",
      link: row?.link ?? "",
    });
    setPhotoFile(null);
    setPhotoPreview(row?.photo ?? null);
    setRemovePhoto(false);
    setSubmitError(null);
  }, [row, reset]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  function handlePhotoChange(file: File | undefined) {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
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

  async function onSubmit(values: AcademicFormValues) {
    setSubmitError(null);

    const supabase = createSupabaseBrowserClient();
    const storage = createPhotoStorage(supabase);
    const bucket = PHOTO_BUCKETS.academic;

    let uploadedPath: string | null = null;
    const previousPhoto = row?.photo ?? null;
    let photo: string | null = removePhoto ? null : previousPhoto;

    try {
      if (photoFile) {
        const uploaded = await storage.upload(bucket, photoFile);
        photo = uploaded.publicUrl;
        uploadedPath = uploaded.path;
      }

      const payload: AcademicFormValues = {
        name: values.name.trim(),
        photo: photo ?? "",
        link: values.link?.trim() ?? "",
      };

      let result: AcademicActionResult<Academic>;

      if (mode === "create") {
        result = await createAction(payload);
      } else {
        if (!row) throw new Error("The academic record could not be found.");
        result = await updateAction(row.id, payload);
      }

      if (!result.success) {
        throw new Error(result.message || "Unable to save the academic record.");
      }

      if (previousPhoto && previousPhoto !== photo) {
        const oldPath = getStoragePathFromPublicUrl(previousPhoto, bucket);

        if (oldPath) {
          try {
            await storage.remove(bucket, oldPath);
          } catch (error) {
            console.error("Unable to remove the previous academic photo:", error);
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
          console.error("Unable to clean up the uploaded photo:", cleanupError);
        }
      }

      setSubmitError(
        error instanceof Error ? error.message : "Unable to save the academic record.",
      );
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor={`${formId}-name`}>Name *</Label>
        <Input
          id={`${formId}-name`}
          {...register("name")}
          placeholder="Enter academic resource name"
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-link`}>Link</Label>
        <Input
          id={`${formId}-link`}
          type="url"
          {...register("link")}
          placeholder="https://example.com"
          disabled={isSubmitting}
          aria-invalid={!!errors.link}
        />
        {errors.link && (
          <p className="text-xs text-destructive">{errors.link.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Photo</Label>
        {photoPreview && (
          <div className="flex items-center gap-4">
            <Image
              src={photoPreview}
              alt="Academic preview"
              className="size-20 rounded-lg border object-cover"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                setPhotoFile(null);
                setPhotoPreview(null);
                setRemovePhoto(true);
                setSubmitError(null);
              }}
            >
              <X className="mr-2 size-4" />
              Remove photo
            </Button>
          </div>
        )}
        <label
          htmlFor={`${formId}-photo`}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center hover:bg-muted/50"
        >
          <ImagePlus className="mb-2 size-6 text-muted-foreground" />
          <span className="text-sm font-medium">
            {photoPreview ? "Choose a different photo" : "Choose a photo"}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            JPEG, PNG, WebP, GIF or AVIF · Maximum 5 MB
          </span>
        </label>
        <input
          id={`${formId}-photo`}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          disabled={isSubmitting}
          onChange={(event) => {
            handlePhotoChange(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-destructive">{submitError}</p>
      )}
    </form>
  );
}
