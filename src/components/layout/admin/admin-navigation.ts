import {
  FileText,
  KeyRound,
  LayoutDashboard,
  PersonStanding,
  School,
  Settings,
  ShieldCheck,
  Users,
  BookOpen,
  History,
  UserRound,
  BriefcaseBusiness,
  Images,
} from "lucide-react";

import type { PermissionKey } from "@/lib/auth/permissions";
import { permissions } from "@/lib/auth/permissions";

export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  permission: PermissionKey;
}

export interface NavigationSection {
  heading?: string;
  items: NavigationItem[];
}

export const navigation: NavigationSection[] = [
  {
    items: [
      {
        label: "Home",
        href: "/admin/home",
        icon: LayoutDashboard,
        permission: permissions.dashboardRead,
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
        permission: permissions.usersRead,
      },
      {
        label: "Roles",
        href: "/admin/roles",
        icon: ShieldCheck,
        permission: permissions.rolesRead,
      },
      {
        label: "Permissions",
        href: "/admin/permissions",
        icon: KeyRound,
        permission: permissions.permissionsRead,
      },
      {
        label: "Content",
        href: "/admin/content",
        icon: FileText,
        permission: permissions.newsRead,
      },
    ],
  },
  {
    heading: "MANAGE",
    items: [
      {
        label: "School Information",
        href: "/admin/school-info",
        icon: School,
        permission: permissions.schoolRead,
      },
      {
        label: "Notable Alumni",
        href: "/admin/notable",
        icon: PersonStanding,
        permission: permissions.alumniRead,
      },
      {
        label: "Academic Resources",
        href: "/admin/academic",
        icon: BookOpen,
        permission: permissions.academicRead,
      },
      {
        label: "Leadership",
        href: "/admin/leadership",
        icon: History,
        permission: permissions.pastLeadershipRead,
      },
      {
        label: "Student Leadership",
        href: "/admin/pupils",
        icon: UserRound,
        permission: permissions.studentsRead,
      },
      {
        label: "Staff",
        href: "/admin/staff",
        icon: BriefcaseBusiness,
        permission: permissions.staffRead,
      },
      {
        label: "Media",
        href: "/admin/media",
        icon: Images,
        permission: permissions.mediaRead,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        permission: permissions.settingsRead,
      },
    ],
  },
];