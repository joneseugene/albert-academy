
import { z } from "zod";
import {
  requiredString,
  optionalString,
  integerSchema,
} from "@/lib/schemas/base.schema";

export const pupilSchema = z
  .object({
    name: requiredString("Name is required"),
    photo: optionalString,
    role: requiredString("Role is required"),
    level: optionalString,
    start_year: integerSchema.nullable().optional(),
    end_year: integerSchema.nullable().optional(),
  })
  .refine(
    (data) =>
      data.start_year == null ||
      data.end_year == null ||
      data.end_year >= data.start_year,
    {
      message: "End year must be greater than or equal to start year",
      path: ["end_year"],
    },
  );

export type PupilFormValues = z.infer<
  typeof pupilSchema
>;
