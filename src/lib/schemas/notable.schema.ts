import { z } from "zod";

export const notableSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(
    150,
    "Name must not exceed 150 characters.",
  ),

  photo: z.union([
    z.literal(""),
    z.string().url("Enter a valid photo URL."),
    z.null(),
  ]),

  title: z.string().trim().max(
    150,
    "Title must not exceed 150 characters.",
  ),

  description: z.string().max(
    2000,
    "Description must not exceed 2,000 characters.",
  ),

  detail: z.string().max(
    10000,
    "Details must not exceed 10,000 characters.",
  ),
});

export type NotableFormValues = z.infer<typeof notableSchema>;

export const emptyNotable: NotableFormValues = {
  name: "",
  photo: "",
  title: "",
  description: "",
  detail: "",
};