
import { z } from "zod";

export const schoolInfoSchema = z.object({
  name: z.string().trim().min(1, "School name is required."),
  about: z.string(),
  vision: z.string(),
  mission: z.string(),
  history: z.string(),
  founder: z.string(),

  contact: z.object({
    address: z.string(),
    mobile_line_1: z.string(),
    mobile_line_2: z.string(),
    email: z.union([
      z.literal(""),
      z.string().email("Enter a valid email address."),
    ]),
    po_box: z.string(),
    facebook_url: z.string(),
    youtube_url: z.string(),
    tweeter_url: z.string(),
    tiktok_url: z.string(),
  }),
});

export type SchoolInfoFormValues = z.infer<
  typeof schoolInfoSchema
>;

export const emptySchoolInfo: SchoolInfoFormValues = {
  name: "Albert Academy",
  about: "",
  vision: "",
  mission: "",
  history: "",
  founder: "",
  contact: {
    address: "",
    mobile_line_1: "",
    mobile_line_2: "",
    email: "",
    po_box: "",
    facebook_url: "",
    youtube_url: "",
    tweeter_url: "",
    tiktok_url: "",
  },
};
