"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Bell,
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import type { CurrentUserProfile } from "@/lib/auth/get-current-user-profile";
import {
  getDisplayName,
  getInitials,
} from "@/lib/functions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface AdminTopbarProps {
  profile: CurrentUserProfile;
  onMenuClick: () => void;
}

export function AdminTopbar({
  profile,
  onMenuClick,
}: AdminTopbarProps) {
  const router = useRouter();

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [signingOut, setSigningOut] =
    useState(false);

  const userMenuRef =
    useRef<HTMLDivElement>(null);

  const displayName = getDisplayName(profile);
  const initials = getInitials(displayName);

  const roleName =
    profile.role?.name ?? "Administrator";

  /* ============================================================
     Close user menu when clicking outside
  ============================================================ */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  /* ============================================================
     Close user menu with Escape
  ============================================================ */

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  /* ============================================================
     Sign out
  ============================================================ */

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    try {
      const supabase =
        createSupabaseBrowserClient();

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      setUserMenuOpen(false);

      router.replace("/login");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* ========================================================
          Left side
      ======================================================== */}

      <div className="flex flex-1 items-center gap-3">
        {/* Mobile menu */}

        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 transition-colors hover:bg-muted lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>

      </div>

      {/* ========================================================
          Right side
      ======================================================== */}

      <div className="flex items-center gap-2 sm:gap-4">
        {/* ======================================================
            Notifications
        ====================================================== */}

        <button
          type="button"
          className="relative rounded-lg p-2 transition-colors hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-5" />

          <span
            className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#7A1523]"
            aria-hidden="true"
          />
        </button>

        {/* ======================================================
            User menu
        ====================================================== */}

        <div
          ref={userMenuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setUserMenuOpen(
                (open) => !open,
              )
            }
            className={[
              "flex items-center gap-2 rounded-lg px-2 py-1.5",
              "transition-colors hover:bg-muted",
              "focus:outline-none focus:ring-2 focus:ring-[#7A1523]/30",
            ].join(" ")}
            aria-label="Open user menu"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            {/* Avatar */}

            <div className="flex size-8 items-center justify-center rounded-full bg-[#7A1523] text-xs font-semibold text-white">
              {initials}
            </div>

            <ChevronDown
              className={[
                "hidden size-4 text-muted-foreground transition-transform md:block",
                userMenuOpen
                  ? "rotate-180"
                  : "",
              ].join(" ")}
            />
          </button>

          {/* ====================================================
              Dropdown
          ==================================================== */}

          {userMenuOpen && (
            <div
              role="menu"
              aria-label="User menu"
              className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-background shadow-lg"
            >
              {/* User information */}

              <div className="border-b px-4 py-3">
                <p className="truncate text-sm font-semibold">
                  {displayName}
                </p>

                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {roleName}
                </p>
              </div>

              {/* Menu items */}

              <div className="p-2">
                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() =>
                    setUserMenuOpen(false)
                  }
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <User className="size-4 text-muted-foreground" />

                  <div>
                    <p className="font-medium">
                      My Profile
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Manage your profile
                    </p>
                  </div>
                </Link>

                <Link
                  href="/settings"
                  role="menuitem"
                  onClick={() =>
                    setUserMenuOpen(false)
                  }
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                >
                  <Settings className="size-4 text-muted-foreground" />

                  <div>
                    <p className="font-medium">
                      Settings
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Manage system settings
                    </p>
                  </div>
                </Link>
              </div>

              {/* Sign out */}

              <div className="border-t p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
                >
                  <LogOut className="size-4" />

                  <div>
                    <p className="font-medium">
                      {signingOut
                        ? "Signing out..."
                        : "Sign out"}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

