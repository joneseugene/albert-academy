"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { inviteUserSchema, type InviteUserInput } from "@/lib/schemas/invite.user.schema";

import { updateUserSchema, type UpdateUserInput } from "@/lib/schemas/user.schema";

import type { ResourceFormProps } from "@/components/resource/types";
import type { UserResourceItem } from "./user-resource";
import { formatRoleName } from "@/lib/functions";

export interface UserRoleOption {
  id: string;
  name: string;
  description?: string | null;
}

interface UserFormProps extends ResourceFormProps<UserResourceItem> {
  roles: UserRoleOption[];
}

export function UserForm({ mode, row, roles, onSuccess }: UserFormProps) {
  if (mode === "create") {
    return <InviteUserForm roles={roles} onSuccess={onSuccess} />;
  }

  return <EditUserForm row={row} roles={roles} onSuccess={onSuccess} />;
}

/* =========================================================
   CREATE / INVITE
========================================================= */

interface InviteUserFormProps {
  roles: UserRoleOption[];
  onSuccess: () => void | Promise<void>;
}

function InviteUserForm({ roles, onSuccess }: InviteUserFormProps) {
  const formId = "users-create-form";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
    },
  });

  const handleFormSubmit = async (values: InviteUserInput) => {
    try {
      console.log("Invite user:", values);

      /*
       * Call inviteUserAction(values)
       * here.
       */

      await onSuccess();
    } catch (error) {
      console.error("Failed to invite user:", error);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* First name */}
      <div className="space-y-2">
        <Label htmlFor="firstName">First name</Label>

        <Input
          id="firstName"
          {...register("firstName")}
          disabled={isSubmitting}
          placeholder="John"
          autoComplete="given-name"
        />

        {errors.firstName ? (
          <p className="text-xs text-destructive">{errors.firstName.message}</p>
        ) : null}
      </div>

      {/* Last name */}
      <div className="space-y-2">
        <Label htmlFor="lastName">Last name</Label>

        <Input
          id="lastName"
          {...register("lastName")}
          disabled={isSubmitting}
          placeholder="Doe"
          autoComplete="family-name"
        />

        {errors.lastName ? (
          <p className="text-xs text-destructive">{errors.lastName.message}</p>
        ) : null}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>

        <Input
          id="email"
          type="email"
          {...register("email")}
          disabled={isSubmitting}
          placeholder="john@example.com"
          autoComplete="email"
        />

        {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="roleId">Role</Label>

        <Controller
          name="roleId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
              <SelectTrigger id="roleId" className="w-full">
                <SelectValue placeholder="Select a role">
                  {(() => {
                    const selectedRole = roles.find((role) => role.id === field.value);

                    return selectedRole ? formatRoleName(selectedRole.name) : "Select a role";
                  })()}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {formatRoleName(role.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.roleId ? <p className="text-xs text-destructive">{errors.roleId.message}</p> : null}
      </div>
    </form>
  );
}

/* =========================================================
   EDIT
========================================================= */

interface EditUserFormProps {
  row?: UserResourceItem;
  roles: UserRoleOption[];
  onSuccess: () => void | Promise<void>;
}

function EditUserForm({ row, roles, onSuccess }: EditUserFormProps) {
  const formId = "users-edit-form";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),

    defaultValues: {
      firstName: row?.first_name ?? "",
      lastName: row?.last_name ?? "",
      email: row?.email ?? "",
      roleId: row?.role?.id ?? "",
      isActive: row?.is_active ?? true,
    },
  });

  const handleFormSubmit = async (values: UpdateUserInput) => {
    if (!row) {
      return;
    }

    try {
      console.log("Update user:", row.id, values);

      /*
       * Call updateUserAction(row.id, values)
       * here.
       */

      await onSuccess();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* First name */}
      <div className="space-y-2">
        <Label htmlFor="firstName">First name</Label>

        <Input
          id="firstName"
          {...register("firstName")}
          disabled={isSubmitting}
          placeholder="John"
          autoComplete="given-name"
        />

        {errors.firstName ? (
          <p className="text-xs text-destructive">{errors.firstName.message}</p>
        ) : null}
      </div>

      {/* Last name */}
      <div className="space-y-2">
        <Label htmlFor="lastName">Last name</Label>

        <Input
          id="lastName"
          {...register("lastName")}
          disabled={isSubmitting}
          placeholder="Doe"
          autoComplete="family-name"
        />

        {errors.lastName ? (
          <p className="text-xs text-destructive">{errors.lastName.message}</p>
        ) : null}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>

        <Input
          id="email"
          type="email"
          {...register("email")}
          disabled={isSubmitting}
          placeholder="john@example.com"
          autoComplete="email"
        />

        {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="edit-roleId">Role</Label>

        <Controller
          name="roleId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger id="roleId" className="w-full">
                <SelectValue placeholder="Select a role">
                  {(() => {
                    const selectedRole = roles.find((role) => role.id === field.value);

                    return selectedRole ? formatRoleName(selectedRole.name) : "Select a role";
                  })()}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {formatRoleName(role.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.roleId ? <p className="text-xs text-destructive">{errors.roleId.message}</p> : null}
      </div>

      {/* Active */}
      <div className="flex items-center gap-2 pt-1">
        <input
          id="isActive"
          type="checkbox"
          {...register("isActive")}
          disabled={isSubmitting}
          className="size-4 rounded border-input"
        />

        <Label htmlFor="isActive">Active account</Label>
      </div>
    </form>
  );
}
