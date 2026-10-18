export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { getCurrentUserProfile } from "@/lib/auth/get-current-user-profile";
import { getCurrentUserPermissions } from "@/lib/auth/get-current-user-permissions";
import { permissions } from "@/lib/auth/permissions";

/* ============================================================
   Types
============================================================ */

interface ProfileLike {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

interface DashboardStatItem {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardStatProps {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface QuickActionProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SystemStatusProps {
  label: string;
  status: string;
}

/* ============================================================
   Page
============================================================ */

export default async function HomePage() {
  const profile = await getCurrentUserProfile();

  if (!profile || !profile.is_active) {
    redirect("/login");
  }

  const userPermissions = await getCurrentUserPermissions();

  /* ==========================================================
     Permissions
  ========================================================== */

  const canViewUsers = userPermissions.includes(
    permissions.usersRead,
  );

  const canManageUsers = userPermissions.includes(
    permissions.profilesManage,
  );

  const canViewNews = userPermissions.includes(
    permissions.newsRead,
  );

  const canManageNews = userPermissions.includes(
    permissions.newsCreate,
  );

  const canViewAlumni = userPermissions.includes(
    permissions.alumniRead,
  );

  const canManageAlumni = userPermissions.includes(
    permissions.alumniCreate,
  );

  const canViewRoles = userPermissions.includes(
    permissions.rolesRead,
  );

  const canViewPermissions = userPermissions.includes(
    permissions.permissionsRead,
  );

  const canViewSettings = userPermissions.includes(
    permissions.settingsRead,
  );

  const canViewSchool = userPermissions.includes(
    permissions.schoolRead,
  );

  const canManageSchool = userPermissions.includes(
    permissions.schoolUpdate,
  );

  /* ==========================================================
     Profile
  ========================================================== */

  const displayName = getDisplayName(profile);
  const firstName = getFirstName(displayName);

  /* ==========================================================
     Dashboard type
     
     A School Admin dashboard is a focused workspace for users
     who can manage school information but do not administer
     RBAC.
  ========================================================== */

  const isSchoolAdminDashboard =
    canViewSchool &&
    canManageSchool &&
    !canViewRoles &&
    !canViewPermissions;

  if (isSchoolAdminDashboard) {
    return (
      <SchoolAdminDashboard
        profile={profile}
        firstName={firstName}
        canViewNews={canViewNews}
        canManageNews={canManageNews}
        canViewAlumni={canViewAlumni}
        canManageAlumni={canManageAlumni}
        canViewUsers={canViewUsers}
        canManageUsers={canManageUsers}
        canViewSettings={canViewSettings}
        canViewSchool={canViewSchool}
        canManageSchool={canManageSchool}
      />
    );
  }

  return (
    <SuperAdminDashboard
      firstName={firstName}
      canViewUsers={canViewUsers}
      canManageUsers={canManageUsers}
      canViewNews={canViewNews}
      canManageNews={canManageNews}
      canViewAlumni={canViewAlumni}
      canManageAlumni={canManageAlumni}
      canViewRoles={canViewRoles}
      canViewPermissions={canViewPermissions}
      canViewSettings={canViewSettings}
      canViewSchool={canViewSchool}
      canManageSchool={canManageSchool}
    />
  );
}

/* ============================================================
   School Admin Dashboard
============================================================ */

interface SchoolAdminDashboardProps {
  profile: ProfileLike;
  firstName: string;
  canViewNews: boolean;
  canManageNews: boolean;
  canViewAlumni: boolean;
  canManageAlumni: boolean;
  canViewUsers: boolean;
  canManageUsers: boolean;
  canViewSettings: boolean;
  canViewSchool: boolean;
  canManageSchool: boolean;
}

function SchoolAdminDashboard({
  firstName,
  canViewNews,
  canManageNews,
  canViewAlumni,
  canManageAlumni,
  canViewUsers,
  canManageUsers,
  canViewSettings,
  canViewSchool,
  canManageSchool,
}: SchoolAdminDashboardProps) {
  const visibleStats: DashboardStatItem[] = [
    canViewSchool
      ? {
          label: "School Information",
          description: "Institutional information",
          href: "/school-info",
          icon: GraduationCap,
        }
      : null,

    canViewNews
      ? {
          label: "News",
          description: "School news and updates",
          href: "/news",
          icon: Newspaper,
        }
      : null,

    canViewAlumni
      ? {
          label: "Alumni",
          description: "Alumni records",
          href: "/alumni",
          icon: Users,
        }
      : null,

    canViewUsers
      ? {
          label: "Administrators",
          description: "Registered administrators",
          href: "/users",
          icon: Users,
        }
      : null,
  ].filter(
    (item): item is DashboardStatItem => item !== null,
  );

  const hasQuickActions =
    canManageSchool ||
    canManageNews ||
    canManageAlumni ||
    canManageUsers ||
    canViewSettings;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8">
      {/* ======================================================
          Hero
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border bg-background">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-24 -translate-y-24 rounded-full bg-[#7A1523]/5" />

        <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <GraduationCap className="size-3.5 text-[#7A1523]" />
              School Administration
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Good morning
              {firstName ? `, ${firstName}` : ""}.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Welcome to the Albert Academy school administration
              workspace. Manage the school&apos;s institutional
              information, content, and records from one place.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {canManageSchool && (
                <Link
                  href="/school-info"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#7A1523] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#65121e] hover:shadow-md"
                >
                  Manage school information

                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}

              {canViewNews && (
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  View school news

                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          Overview
      ====================================================== */}

      {visibleStats.length > 0 && (
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              School overview
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              Your school workspace
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visibleStats.map((stat) => (
              <DashboardStat
                key={stat.href}
                label={stat.label}
                description={stat.description}
                href={stat.href}
                icon={stat.icon}
              />
            ))}
          </div>
        </section>
      )}

      {/* ======================================================
          Workspace
      ====================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* School information */}
        <div className="overflow-hidden rounded-2xl border bg-background">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Institution
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                School information
              </h2>
            </div>

            <div className="flex size-9 items-center justify-center rounded-lg bg-[#7A1523]/10 text-[#7A1523]">
              <GraduationCap className="size-4" />
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="max-w-xl">
              <p className="text-sm leading-6 text-muted-foreground">
                Maintain the official information presented across
                the Albert Academy digital platform, including the
                school&apos;s history, leadership, contacts,
                notable alumni, school song, and social media
                information.
              </p>

              {canManageSchool && (
                <Link
                  href="/school-info"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#7A1523] hover:underline"
                >
                  Manage school information
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="overflow-hidden rounded-2xl border bg-background">
          <div className="border-b px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Workspace
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              Quick actions
            </h2>
          </div>

          <div className="space-y-1.5 p-3">
            {canManageSchool && (
              <QuickAction
                href="/school-info"
                icon={GraduationCap}
                title="Manage school information"
                description="Update institutional information"
              />
            )}

            {canManageNews && (
              <QuickAction
                href="/news"
                icon={Newspaper}
                title="Manage news"
                description="Publish and update school news"
              />
            )}

            {canManageAlumni && (
              <QuickAction
                href="/alumni"
                icon={Users}
                title="Manage alumni"
                description="Maintain alumni records"
              />
            )}

            {canManageUsers && (
              <QuickAction
                href="/users"
                icon={Users}
                title="Manage users"
                description="Administrators and profiles"
              />
            )}

            {canViewSettings && (
              <QuickAction
                href="/settings"
                icon={Settings}
                title="Settings"
                description="Configure the administration portal"
              />
            )}

            {!hasQuickActions && (
              <div className="px-3 py-8 text-center">
                <p className="text-sm font-medium">
                  No quick actions available
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Your assigned permissions determine the actions
                  available here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <SystemStatusSection />
    </div>
  );
}

/* ============================================================
   Super Admin Dashboard
============================================================ */

interface SuperAdminDashboardProps {
  firstName: string;
  canViewUsers: boolean;
  canManageUsers: boolean;
  canViewNews: boolean;
  canManageNews: boolean;
  canViewAlumni: boolean;
  canManageAlumni: boolean;
  canViewRoles: boolean;
  canViewPermissions: boolean;
  canViewSettings: boolean;
  canViewSchool: boolean;
  canManageSchool: boolean;
}

function SuperAdminDashboard({
  firstName,
  canViewUsers,
  canManageUsers,
  canViewNews,
  canManageNews,
  canViewAlumni,
  canManageAlumni,
  canViewRoles,
  canViewPermissions,
  canViewSettings,
  canViewSchool,
  canManageSchool,
}: SuperAdminDashboardProps) {
  const visibleStats: DashboardStatItem[] = [
    canViewUsers
      ? {
          label: "Administrators",
          description: "Registered system users",
          href: "/users",
          icon: Users,
        }
      : null,

    canViewAlumni
      ? {
          label: "Alumni",
          description: "Alumni records",
          href: "/alumni",
          icon: GraduationCap,
        }
      : null,

    canViewNews
      ? {
          label: "News",
          description: "Published school content",
          href: "/news",
          icon: Newspaper,
        }
      : null,

    canViewRoles
      ? {
          label: "Roles",
          description: "Configured access roles",
          href: "/roles",
          icon: ShieldCheck,
        }
      : null,
  ].filter(
    (item): item is DashboardStatItem => item !== null,
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8">
      {/* ======================================================
          Hero
      ====================================================== */}

      <section className="relative overflow-hidden">
        <div className="relative px-2 py-8 sm:px-4 sm:py-10 lg:px-2 lg:py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Good morning
              {firstName ? `, ${firstName}` : ""}.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Welcome to the Albert Academy administration
              portal. Manage the school&apos;s digital presence,
              people, content, and institutional information from
              one central workspace.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {canViewUsers && (
                <Link
                  href="/users"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#7A1523] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#65121e] hover:shadow-md"
                >
                  Manage users
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}

              {canViewSchool && (
                <Link
                  href="/school-info"
                  className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {canManageSchool
                    ? "Manage school information"
                    : "School information"}

                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          Overview
      ====================================================== */}

      {visibleStats.length > 0 && (
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Overview
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              Administration at a glance
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visibleStats.map((stat) => (
              <DashboardStat
                key={stat.href}
                label={stat.label}
                description={stat.description}
                href={stat.href}
                icon={stat.icon}
              />
            ))}
          </div>
        </section>
      )}

      {/* ======================================================
          Workspace
      ====================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-2xl border bg-background">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Activity
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                Recent activity
              </h2>
            </div>

            <div className="flex size-9 items-center justify-center rounded-lg bg-muted/70">
              <LayoutDashboard className="size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="px-6 py-10">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
              <div className="relative flex size-14 items-center justify-center rounded-2xl border bg-muted/40">
                <FileText className="size-6 text-muted-foreground" />

                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-background bg-[#7A1523]">
                  <span className="size-1.5 rounded-full bg-white" />
                </span>
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                No recent activity
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                Administrative activity will appear here as users
                create, update, and manage school records.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-background">
          <div className="border-b px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Workspace
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              Quick actions
            </h2>
          </div>

          <div className="space-y-1.5 p-3">
            {canManageUsers && (
              <QuickAction
                href="/users"
                icon={Users}
                title="Manage users"
                description="Administrators and profiles"
              />
            )}

            {canManageNews && (
              <QuickAction
                href="/news"
                icon={Newspaper}
                title="Manage news"
                description="Publish and update school news"
              />
            )}

            {canManageAlumni && (
              <QuickAction
                href="/alumni"
                icon={GraduationCap}
                title="Manage alumni"
                description="Maintain alumni records"
              />
            )}

            {canViewRoles && (
              <QuickAction
                href="/roles"
                icon={ShieldCheck}
                title="Roles & access"
                description="Review configured system roles"
              />
            )}

            {canViewPermissions && (
              <QuickAction
                href="/permissions"
                icon={KeyRound}
                title="Permissions"
                description="Review system permissions"
              />
            )}

            {canViewSettings && (
              <QuickAction
                href="/settings"
                icon={Settings}
                title="Settings"
                description="Configure the administration portal"
              />
            )}
          </div>
        </div>
      </section>

      <SystemStatusSection />
    </div>
  );
}

/* ============================================================
   System Status
============================================================ */

function SystemStatusSection() {
  return (
    <section className="overflow-hidden rounded-2xl border bg-background">
      <div className="flex flex-col gap-1 border-b px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Infrastructure
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight">
            System status
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>

          All systems operational
        </div>
      </div>

      <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <SystemStatus
          label="Authentication"
          status="Operational"
        />

        <SystemStatus
          label="Database"
          status="Operational"
        />

        <SystemStatus
          label="Administration Portal"
          status="Operational"
        />
      </div>
    </section>
  );
}

/* ============================================================
   Profile helpers
============================================================ */

function getDisplayName(profile: ProfileLike): string {
  const name = [
    profile.first_name,
    profile.last_name,
  ]
    .filter(
      (value): value is string =>
        Boolean(value?.trim()),
    )
    .join(" ")
    .trim();

  return name || profile.email || "Administrator";
}

function getFirstName(displayName: string): string {
  const firstName = displayName
    .trim()
    .split(/\s+/)[0];

  return firstName ?? "";
}

/* ============================================================
   Dashboard stat
============================================================ */

function DashboardStat({
  label,
  description,
  href,
  icon: Icon,
}: DashboardStatProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border bg-background p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7A1523]/30 hover:shadow-lg hover:shadow-[#7A1523]/5"
    >
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-[#7A1523]/5 transition-transform duration-300 group-hover:scale-150" />

      <div className="relative flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#7A1523]/10 text-[#7A1523]">
          <Icon className="size-[18px]" />
        </div>

        <div className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-[#7A1523]/10 group-hover:text-[#7A1523]">
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>

      <div className="relative mt-6">
        <p className="text-xl font-semibold tracking-tight">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
}

/* ============================================================
   Quick action
============================================================ */

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted/70"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#7A1523]/10 text-[#7A1523] transition-colors group-hover:bg-[#7A1523] group-hover:text-white">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
}

/* ============================================================
   System status item
============================================================ */

function SystemStatus({
  label,
  status,
}: SystemStatusProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="size-4" />
        </div>

        <div>
          <p className="text-sm font-medium">
            {label}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            System status
          </p>
        </div>
      </div>

      <span className="text-xs font-medium text-emerald-600">
        {status}
      </span>
    </div>
  );
}

