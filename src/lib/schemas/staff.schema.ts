
import { z } from "zod";
import {
  requiredString,
  optionalString,
  integerSchema,
} from "@/lib/schemas/base.schema";

export const staffSchema = z.object({
  name: requiredString("Name is required"),
  photo: optionalString,
  role: requiredString("Role is required"),
  level: optionalString,
  start_year: integerSchema.nullable().optional(),
  end_year: integerSchema.nullable().optional(),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
