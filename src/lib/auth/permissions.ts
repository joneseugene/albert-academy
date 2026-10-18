export const permissions = {
  // Navigation / read permissions
  dashboardRead: "dashboard.read",
  usersRead: "users.read",
  rolesRead: "roles.read",
  permissionsRead: "permissions.read",
  settingsRead: "settings.read",

  // Alumni / notable people
  alumniRead: "alumni.read",
  alumniCreate: "alumni.create",
  alumniUpdate: "alumni.update",
  alumniDelete: "alumni.delete",

  // News
  newsRead: "news.read",
  newsCreate: "news.create",
  newsUpdate: "news.update",
  newsDelete: "news.delete",

  // Leadership
  leadershipManage: "leadership.manage",
  principalsManage: "principals.manage",

  // Academic
  academicRead: "academic.read",
  academicCreate: "academic.create",
  academicUpdate: "academic.update",
  academicDelete: "academic.delete",

  // Did You Know
  didYouKnowRead: "did_you_know.read",
  didYouKnowCreate: "did_you_know.create",
  didYouKnowUpdate: "did_you_know.update",
  didYouKnowDelete: "did_you_know.delete",

  // Students
  studentsRead: "students.read",
  studentsCreate: "students.create",
  studentsUpdate: "students.update",
  studentsDelete: "students.delete",

  // Staff
  staffRead: "staff.read",
  staffCreate: "staff.create",
  staffUpdate: "staff.update",
  staffDelete: "staff.delete",

  // Leadership
  pastLeadershipRead: "past_leadership.read",
  pastLeadershipCreate: "past_leadership.create",
  pastLeadershipUpdate: "past_leadership.update",
  pastLeadershipDelete: "past_leadership.delete",

  // Media
  mediaRead: "media.read",
  mediaCreate: "media.create",
  mediaUpdate: "media.update",
  mediaDelete: "media.delete",

  // Profiles
  profilesManage: "profiles.manage",

  // Roles & permissions
  rolesManage: "roles.manage",
  rolePermissionsManage: "role_permissions.manage",
  userPermissionsManage: "user_permissions.manage",
  permissionsManage: "permissions.manage",

  // School
  schoolRead: "school.read",
  schoolCreate: "school.create",
  schoolUpdate: "school.update",
  schoolDelete: "school.delete",

  // School song
  schoolSongManage: "school_song.manage",
} as const;

export type PermissionKey =
  (typeof permissions)[keyof typeof permissions];