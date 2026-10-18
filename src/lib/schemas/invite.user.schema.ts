import { z } from "zod";

import {
  emailSchema,
  requiredString,
  uuidSelectSchema,
} from "./base.schema";

export const inviteUserSchema = z.object({
  firstName: requiredString(
    "First name is required",
    100,
  ),

  lastName: requiredString(
    "Last name is required",
    100,
  ),

  email: emailSchema,

  roleId: uuidSelectSchema,
});

export type InviteUserInput =
  z.infer<typeof inviteUserSchema>;