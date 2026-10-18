import { z } from "zod";

import {
  optionalEmailSchema,
  optionalString,
  optionalUuidSelectSchema,
} from "./base.schema";

export const updateUserSchema = z.object({
  firstName: optionalString,

  lastName: optionalString,

  email: optionalEmailSchema,

  roleId: optionalUuidSelectSchema,

  isActive: z.boolean().optional(),
});

export type UpdateUserInput =
  z.infer<typeof updateUserSchema>;