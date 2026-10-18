export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { School } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/auth/get-current-user-profile";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";
import { createSchoolInfoRepository } from "@/lib/repositories/school_info.repository";
import { SchoolInfoForm } from "@/features/admin/info/school_info.form";

export const metadata = {
  title: "School Information | Albert Academy",
};

export default async function SchoolInfoPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  const userPermissions = await getCurrentUserPermissions();

  if (!userPermissions.includes(permissions.schoolRead)) {
    redirect("/");
  }

  const repository = await createSchoolInfoRepository();
  const schoolInfo = await repository.get();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex items-start gap-4">
          <div className="rounded-xl bg-[#7A1523] p-3 text-white">
            <School className="size-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              School Information
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Manage Albert Academy&apos;s identity, history, vision,
              mission, contact details, and social media links.
              Changes are stored in the school&apos;s central information record.
            </p>

            <div className="mt-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  schoolInfo
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {schoolInfo
                  ? "School information configured"
                  : "Initial setup required"}
              </span>
            </div>
          </div>
        </header>

        <SchoolInfoForm initialData={schoolInfo} />
      </div>
    </main>
  );
}
