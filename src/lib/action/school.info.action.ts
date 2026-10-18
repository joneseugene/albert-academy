
"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserProfile } from "@/lib/auth/get-current-user-profile";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";
import type { SchoolInfoFormValues} from "../schemas/school.info.schema";
import { schoolInfoSchema } from "../schemas/school.info.schema";
import { createSchoolInfoRepository } from "../repositories/school_info.repository";

type SaveSchoolInfoResult = {
  success: boolean;
  message: string;
};

export async function saveSchoolInfo(
  input: SchoolInfoFormValues,
): Promise<SaveSchoolInfoResult> {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile) {
      return {
        success: false,
        message: "Please sign in to continue.",
      };
    }

    const userPermissions = await getCurrentUserPermissions();

    if (!userPermissions.includes(permissions.schoolUpdate)) {
      return {
        success: false,
        message: "You are not authorized to update school information.",
      };
    }

    const parsed = schoolInfoSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message
          ?? "Please check the submitted information.",
      };
    }

    const values = parsed.data;

    const repository = await createSchoolInfoRepository();

    await repository.save({
      name: values.name,
      about: values.about.trim() || null,
      vision: values.vision.trim() || null,
      mission: values.mission.trim() || null,
      history: values.history.trim() || null,
      founder: values.founder.trim() || null,

      contact: {
        address: values.contact.address.trim() || null,
        mobile_line_1: values.contact.mobile_line_1.trim() || null,
        mobile_line_2: values.contact.mobile_line_2.trim() || null,
        email: values.contact.email.trim() || null,
        po_box: values.contact.po_box.trim() || null,
        facebook_url: values.contact.facebook_url.trim() || null,
        youtube_url: values.contact.youtube_url.trim() || null,
        tweeter_url: values.contact.tweeter_url.trim() || null,
        tiktok_url: values.contact.tiktok_url.trim() || null,
      },
    });

    revalidatePath("/school-info");
    revalidatePath("/");

    return {
      success: true,
      message: "School information saved successfully.",
    };
  } catch (error) {
    console.error("Failed to save school information:", error);

    return {
      success: false,
      message: "Unable to save school information. Please try again.",
    };
  }
}
