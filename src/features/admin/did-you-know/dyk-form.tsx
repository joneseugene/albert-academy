"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ResourceFormProps } from "@/components/resource/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createPhotoStorage, PHOTO_BUCKETS } from "@/lib/supabase/photo-storage";
import type { DidYouKnowActionResult } from "@/lib/action/did.you.know.action";
import type { DidYouKnow } from "@/lib/repositories/did_you_know.repository";
import type { DidYouKnowResourceItem } from "./dyk-resource";
import type {
  DidYouKnowFormInput,
  DidYouKnowFormValues} from "@/lib/schemas/did-you-know.schema";
import {
  didYouKnowSchema,
} from "@/lib/schemas/did-you-know.schema";
import Image from "next/image";

// ============================================================
// ACTIONS
// ============================================================

export interface DidYouKnowFormActions {
  createAction: (input: DidYouKnowFormValues) => Promise<DidYouKnowActionResult<DidYouKnow>>;

  updateAction: (
    id: string,
    input: DidYouKnowFormValues,
  ) => Promise<DidYouKnowActionResult<DidYouKnow>>;
}

interface DidYouKnowFormProps
  extends ResourceFormProps<DidYouKnowResourceItem>, DidYouKnowFormActions {}

// ============================================================
// STORAGE HELPERS
// ============================================================

function getStoragePathFromPublicUrl(publicUrl: string, bucket: string): string | null {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.pathname.indexOf(marker);

    return index === -1 ? null : decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

function getDefaultValues(row?: DidYouKnowResourceItem): DidYouKnowFormInput {
  return {
    title: row?.title ?? "",
    description: row?.description ?? "",
    category: row?.category ?? "",
    image: row?.image ?? "",
    imageAlt: row?.image_alt ?? "",
    status: row?.status === "published" ? "published" : "draft",
    displayOrder: row?.display_order ?? 0,
  };
}

// ============================================================
// FORM
// ============================================================

export function DidYouKnowForm({
  mode,
  row,
  onSuccess,
  createAction,
  updateAction,
}: DidYouKnowFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(row?.image ?? null);
  const [removeImage, setRemoveImage] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formId = mode === "create" ? "did-you-know-create-form" : "did-you-know-edit-form";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DidYouKnowFormInput, unknown, DidYouKnowFormValues>({
    resolver: zodResolver(didYouKnowSchema) as Resolver<
      DidYouKnowFormInput,
      unknown,
      DidYouKnowFormValues
    >,
    defaultValues: getDefaultValues(row),
  });

  const currentImage = watch("image");
  const currentImageAlt = watch("imageAlt");

  useEffect(() => {
    reset(getDefaultValues(row));

    setImageFile(null);
    setImagePreview(row?.image ?? null);
    setRemoveImage(false);
    setSubmitError(null);
  }, [row, reset]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleImageChange(file: File | undefined) {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

    if (!allowedTypes.includes(file.type)) {
      setSubmitError("Use JPEG, PNG, WebP, GIF, or AVIF.");
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setSubmitError("The image must be greater than 0 bytes and no larger than 5 MB.");
      return;
    }

    setSubmitError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  async function onSubmit(values: DidYouKnowFormValues) {
    setSubmitError(null);

    const supabase = createSupabaseBrowserClient();
    const storage = createPhotoStorage(supabase);
    const bucket = PHOTO_BUCKETS.didYouKnow;

    let uploadedPath: string | null = null;
    const previousImage = row?.image ?? null;
    let image: string | null = removeImage ? null : previousImage;

    try {
      if (imageFile) {
        const uploaded = await storage.upload(bucket, imageFile);
        image = uploaded.publicUrl;
        uploadedPath = uploaded.path;
      }

      const payload: DidYouKnowFormValues = {
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category.trim(),
        image: image ?? "",
        imageAlt: image ? (values.imageAlt?.trim() ?? "") : "",
        status: values.status,
        displayOrder: values.displayOrder,
      };

      const parsed = didYouKnowSchema.safeParse(payload);

      if (!parsed.success) {
        throw new Error(
          parsed.error.issues[0]?.message ?? "Please check the submitted information.",
        );
      }

      let result: DidYouKnowActionResult<DidYouKnow>;

      if (mode === "create") {
        result = await createAction(parsed.data);
      } else {
        if (!row) {
          throw new Error("The fact could not be found.");
        }

        result = await updateAction(row.id, parsed.data);
      }

      if (!result.success) {
        throw new Error(result.message || "Unable to save the fact.");
      }

      if (previousImage && previousImage !== image) {
        const oldPath = getStoragePathFromPublicUrl(previousImage, bucket);

        if (oldPath) {
          try {
            await storage.remove(bucket, oldPath);
          } catch (error) {
            console.error("Unable to remove the previous Did You Know image:", error);
          }
        }
      }

      // The upload is now associated with the saved record.
      uploadedPath = null;

      await onSuccess();
    } catch (error) {
      if (uploadedPath) {
        try {
          await storage.remove(bucket, uploadedPath);
        } catch (cleanupError) {
          console.error("Unable to clean up the uploaded image:", cleanupError);
        }
      }

      setSubmitError(error instanceof Error ? error.message : "Unable to save the fact.");
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor={`${formId}-title`}>Title *</Label>
        <Input
          id={`${formId}-title`}
          {...register("title")}
          placeholder="e.g. Founded in 1904"
          disabled={isSubmitting}
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor={`${formId}-description`}>Description *</Label>
        <Textarea
          id={`${formId}-description`}
          {...register("description")}
          placeholder="Share an interesting fact about Albert Academy..."
          rows={4}
          disabled={isSubmitting}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor={`${formId}-category`}>Category *</Label>
        <Input
          id={`${formId}-category`}
          {...register("category")}
          placeholder="e.g. History, Tradition, Alumni"
          disabled={isSubmitting}
          aria-invalid={!!errors.category}
        />
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor={`${formId}-status`}>Status</Label>
        <select
          id={`${formId}-status`}
          {...register("status")}
          disabled={isSubmitting}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
      </div>

      {/* Display order */}
      <div className="space-y-2">
        <Label htmlFor={`${formId}-display-order`}>Display order</Label>
        <Input
          id={`${formId}-display-order`}
          type="number"
          min={0}
          step={1}
          {...register("displayOrder", { valueAsNumber: true })}
          disabled={isSubmitting}
          aria-invalid={!!errors.displayOrder}
        />
        {errors.displayOrder && (
          <p className="text-xs text-destructive">{errors.displayOrder.message}</p>
        )}
        <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label htmlFor={`${formId}-image`}>Image (optional)</Label>

        {imagePreview && (
          <div className="flex items-start gap-4">
            <Image
              src={imagePreview}
              alt={currentImageAlt || "Fact image preview"}
              className="size-20 rounded-lg border object-cover"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
                setRemoveImage(true);
                setValue("image", "", { shouldValidate: true });
                setValue("imageAlt", "", { shouldValidate: true });
                setSubmitError(null);
              }}
            >
              <X className="mr-2 size-4" />
              Remove image
            </Button>
          </div>
        )}

        <label
          htmlFor={`${formId}-image`}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center hover:bg-muted/50"
        >
          <ImagePlus className="mb-2 size-6 text-muted-foreground" />
          <span className="text-sm font-medium">
            {imagePreview ? "Choose a different image" : "Choose an image"}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            JPEG, PNG, WebP, GIF or AVIF · Maximum 5 MB
          </span>
        </label>

        <input
          id={`${formId}-image`}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          disabled={isSubmitting}
          onChange={(event) => {
            handleImageChange(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
        />

        {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
      </div>

      {/* Image alt text */}
      {(imagePreview || imageFile || currentImage) && (
        <div className="space-y-2">
          <Label htmlFor={`${formId}-image-alt`}>Image description *</Label>
          <Input
            id={`${formId}-image-alt`}
            {...register("imageAlt")}
            placeholder="Describe the image for accessibility"
            disabled={isSubmitting}
            aria-invalid={!!errors.imageAlt}
          />
          {errors.imageAlt && <p className="text-xs text-destructive">{errors.imageAlt.message}</p>}
        </div>
      )}

      {submitError && (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      )}
    </form>
  );
}
