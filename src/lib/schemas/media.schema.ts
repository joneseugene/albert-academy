
import { z } from "zod";
import {
  requiredString,
  optionalString,
} from "@/lib/schemas/base.schema";

export const mediaSchema = z.object({
  name: requiredString("Name is required"),
  photo: optionalString,
});

export type MediaFormValues = z.infer<typeof mediaSchema>;
