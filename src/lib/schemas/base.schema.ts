import { z } from "zod";


/**
 * Required UUID
 */
export const requiredUuidSchema = z
  .string()
  .trim()
  .uuid("Invalid ID");

/**

* Required text
  */
export const requiredString = (
  message = "This field is required",
  maxLength?: number,
) => {
  let schema = z
    .string()
    .trim()
    .min(1, message);

  if (maxLength !== undefined) {
    schema = schema.max(
      maxLength,
      `Must not exceed ${maxLength} characters`,
    );
  }

  return schema;
};

/**

* Optional text
  */
export const optionalString = z.string().trim().optional().or(z.literal(""));

/**

* Email
  */
/**
 * Email
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .email("Enter a valid email address");

/**

* Optional email
  */
export const optionalEmailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .optional()
  .or(z.literal(""));

/**

* Password
  */
export const passwordSchema = z.string().min(1, "Password is required");

/**

* Strong password
  */
export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must not exceed 72 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/**

* Password confirmation
  */
export const confirmPasswordSchema = z
  .string()
  .min(1, "Please confirm your password");

/**

* Phone number
*
* Allows international formats such as:
* +23276123456
* +1 5551234567
* 076123456
  */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(
    /^\+?[0-9\s()-]{7,20}$/,
    "Enter a valid phone number",
  );

/**

* Optional phone
  */
export const optionalPhoneSchema = z
  .string()
  .trim()
  .regex(
    /^\+?[0-9\s()-]{7,20}$/,
    "Enter a valid phone number",
  )
  .optional()
  .or(z.literal(""));
/**

* URL
  */
export const urlSchema = z.string().trim().url("Enter a valid URL");

/**

* Optional URL
  */
export const optionalUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .optional()
  .or(z.literal(""));

/**

* UUID
  */
export const uuidSchema = z.string().uuid("Invalid ID");

/**

* Date
  */
export const dateSchema = z.string().min(1, "Date is required");

/**

* Optional date
  */
export const optionalDateSchema = z.string().optional().or(z.literal(""));

/**

* Integer
  */
export const integerSchema = z.number().int("Must be a whole number");

/**

* Positive integer
  */
export const positiveIntegerSchema = z
  .number()
  .int("Must be a whole number")
  .positive("Must be greater than zero");

/**

* Checkbox
  */
export const requiredCheckbox = z.boolean().refine((value) => value === true, {
  message: "This field must be accepted",
});

/**

* File
  */
export const fileSchema = z.instanceof(File, {
  message: "Please select a file",
});

/**

* Optional file
  */
export const optionalFileSchema = fileSchema.optional();

/**

* Select value
*
* HTML <select> values are strings.
  */
export const selectSchema = z.string().min(1, "Please select an option");

/**

* Optional select
  */
export const optionalSelectSchema = z.string().optional().or(z.literal(""));

/**
 * Select value containing a UUID
 *
 * Useful for HTML select fields whose values
 * represent database UUIDs.
 */
export const uuidSelectSchema = selectSchema.pipe(
 uuidSchema,
);

export const optionalUuidSelectSchema =
  uuidSelectSchema.optional().or(z.literal(""));