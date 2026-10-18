
import { z } from "zod";
import {
  requiredString,
  optionalString,
  optionalUrlSchema,
} from "@/lib/schemas/base.schema";

export const academicSchema = z.object({
  name: requiredString("Name is required"),
  photo: optionalString,
  link: optionalUrlSchema,
});

export type AcademicFormValues = z.infer<typeof academicSchema>;
