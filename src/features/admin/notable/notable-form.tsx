"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ResourceFormProps } from "@/components/resource/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  createPhotoStorage,
  PHOTO_BUCKETS,
} from "@/lib/supabase/photo-storage";
import type { NotableResourceItem } from "./notable-resource";
import type { Notable } from "@/lib/repositories/notable.repository";
import type { NotableActionResult } from "@/lib/action/notable.action";
import type { NotableFormValues} from "@/lib/schemas/notable.schema";
import { notableSchema } from "@/lib/schemas/notable.schema";
import Image from "next/image";


// ============================================================
// ACTIONS
// ============================================================

export interface NotableFormActions {
  createAction: (
    input: NotableFormValues,
  ) => Promise<NotableActionResult<Notable>>;

  updateAction: (
    id: string,
    input: NotableFormValues,
  ) => Promise<NotableActionResult<Notable>>;
}

// ============================================================
// PROPS
// ============================================================

interface NotableFormProps
  extends ResourceFormProps<NotableResourceItem>,
    NotableFormActions {}

// ============================================================
// HELPERS
// ============================================================

function getStoragePathFromPublicUrl(
  publicUrl: string,
  bucket: string,
): string | null {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(
      url.pathname.slice(markerIndex + marker.length),
    );
  } catch {
    return null;
  }
}

// ============================================================
// COMPONENT
// ============================================================

export function NotableForm({
  mode,
  row,
  onSuccess,
  createAction,
  updateAction,
}: NotableFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    row?.photo ?? null,
  );
  const [removePhoto, setRemovePhoto] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formId =
    mode === "create" ? "notable-create-form" : "notable-edit-form";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NotableFormValues>({
    resolver: zodResolver(notableSchema),
    defaultValues: {
      name: row?.name ?? "",
      photo: row?.photo ?? "",
      title: row?.title ?? "",
      description: row?.description ?? "",
      detail: row?.detail ?? "",
    },
  });

  useEffect(() => {
    setPhotoFile(null);
    setPhotoPreview(row?.photo ?? null);
    setRemovePhoto(false);
    setSubmitError(null);
  }, [row]);

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
      setSubmitError(
        "Unsupported image format. Use JPEG, PNG, WebP, GIF, or AVIF.",
      );
      return;
    }

    if (file.size === 0) {
      setSubmitError("The selected image is empty.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError("The image must not exceed 5 MB.");
      return;
    }

    setSubmitError(null);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
  }

  function handleRemovePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setRemovePhoto(true);
    setSubmitError(null);
  }

  async function onSubmit(values: NotableFormValues) {
    setSubmitError(null);

    const supabase = createSupabaseBrowserClient();
    const photoStorage = createPhotoStorage(supabase);

    let uploadedPhotoPath: string | null = null;

    const previousPhoto = row?.photo ?? null;
    let photo: string | null = removePhoto ? null : previousPhoto;

    try {
      if (photoFile) {
        const uploaded = await photoStorage.upload(
          PHOTO_BUCKETS.notable,
          photoFile,
        );

        photo = uploaded.publicUrl;
        uploadedPhotoPath = uploaded.path;
      }

      // Match the exact input type expected by the server actions.
      const payload: NotableFormValues = {
        name: values.name.trim(),
        photo: photo ?? "",
        title: values.title.trim(),
        description: values.description.trim(),
        detail: values.detail.trim(),
      };

      let result: NotableActionResult<Notable>;

      if (mode === "create") {
        result = await createAction(payload);
      } else {
        if (!row) {
          throw new Error("The notable person could not be found.");
        }

        result = await updateAction(row.id, payload);
      }

      if (!result.success) {
        throw new Error(result.message || "Unable to save the record.");
      }

      // The database save succeeded. Remove the previous stored photo
      // only if it belongs to the expected Supabase Storage bucket.
      if (previousPhoto && previousPhoto !== photo) {
        const previousPath = getStoragePathFromPublicUrl(
          previousPhoto,
          PHOTO_BUCKETS.notable,
        );

        if (previousPath) {
          try {
            await photoStorage.remove(
              PHOTO_BUCKETS.notable,
              previousPath,
            );
          } catch (error) {
            console.error(
              "Record saved, but the previous photo could not be removed:",
              error,
            );
          }
        }
      }

      // Do not remove the newly uploaded image after a successful save.
      uploadedPhotoPath = null;

      await onSuccess();
    } catch (error) {
      if (uploadedPhotoPath) {
        try {
          await photoStorage.remove(
            PHOTO_BUCKETS.notable,
            uploadedPhotoPath,
          );
        } catch (cleanupError) {
          console.error(
            "Failed to clean up the newly uploaded photo:",
            cleanupError,
          );
        }
      }

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the record.",
      );
    }
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor={`${formId}-name`}>Full name *</Label>

        <Input
          id={`${formId}-name`}
          {...register("name")}
          placeholder="Enter full name"
          autoComplete="name"
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
        />

        {errors.name && (
          <p className="text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-title`}>
          Title or designation
        </Label>

        <Input
          id={`${formId}-title`}
          {...register("title")}
          placeholder="e.g. Distinguished alumnus"
          disabled={isSubmitting}
          aria-invalid={!!errors.title}
        />

        {errors.title && (
          <p className="text-xs text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-photo`}>Photo</Label>

        {photoPreview && (
          <div className="flex flex-wrap items-center gap-4">
            <Image
              src={photoPreview}
              alt="Notable person preview"
              className="size-20 rounded-lg border object-cover"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={handleRemovePhoto}
            >
              <X className="mr-2 size-4" />
              Remove photo
            </Button>
          </div>
        )}

        <label
          htmlFor={`${formId}-photo`}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-muted/50"
        >
          <ImagePlus className="mb-2 size-6 text-muted-foreground" />

          <span className="text-sm font-medium">
            {photoPreview
              ? "Choose a different photo"
              : "Choose a photo"}
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

      <div className="space-y-2">
        <Label htmlFor={`${formId}-description`}>
          Short description
        </Label>

        <Textarea
          id={`${formId}-description`}
          {...register("description")}
          placeholder="A short introduction to this person"
          rows={3}
          disabled={isSubmitting}
          aria-invalid={!!errors.description}
        />

        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-detail`}>
          Biography or details
        </Label>

        <Textarea
          id={`${formId}-detail`}
          {...register("detail")}
          placeholder="Enter additional biographical information"
          rows={6}
          disabled={isSubmitting}
          aria-invalid={!!errors.detail}
        />

        {errors.detail && (
          <p className="text-xs text-destructive">
            {errors.detail.message}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      )}

    </form>
  );
}