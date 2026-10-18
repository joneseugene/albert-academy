import { z } from "zod";
import {
  requiredString,
  optionalString,
  optionalUrlSchema,
} from "@/lib/schemas/base.schema";

// ============================================================
// SCHEMA
// ============================================================

export const didYouKnowSchema = z
  .object({
    title: requiredString("Title is required"),

    description: requiredString("Description is required"),

    category: requiredString("Category is required"),

    // Empty string means no image has been selected.
    image: optionalUrlSchema,

    imageAlt: optionalString,

    status: z.enum(["draft", "published"]).default("draft"),

    displayOrder: z.coerce
      .number()
      .int("Display order must be a whole number")
      .min(0, "Display order cannot be negative")
      .default(0),
  })
  .superRefine((values, context) => {
    if (values.image?.trim() && !values.imageAlt?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["imageAlt"],
        message:
          "Image description is required when an image is provided",
      });
    }
  });

// ============================================================
// TYPES
// ============================================================

// Values accepted by React Hook Form before Zod transformations.
export type DidYouKnowFormInput = z.input<
  typeof didYouKnowSchema
>;

// Validated values returned by Zod after transformations.
export type DidYouKnowFormValues = z.output<
  typeof didYouKnowSchema
>;