
import { z } from "zod";
import {
  requiredString,
  optionalString,
  integerSchema,
} from "@/lib/schemas/base.schema";

export const pastLeadershipSchema = z
  .object({
    name: requiredString("Name is required"),
    photo: optionalString,
    role: requiredString("Role is required"),
    level: optionalString,
    start_year: integerSchema.nullable().optional(),
    end_year: integerSchema.nullable().optional(),
    about: optionalString,
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

export type PastLeadershipFormValues = z.infer<
  typeof pastLeadershipSchema
>;
