import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils/cn";
import { parseClientEnv } from "@/lib/env";
import { AppError, toUserMessage } from "@/lib/errors";

describe("cn", () => {
  it("merges conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("parseClientEnv", () => {
  const ok = {
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "key",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  };
  it("accepts a valid environment", () => {
    expect(parseClientEnv(ok).NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });
  it("names missing variables without echoing values", () => {
    expect(() => parseClientEnv({ ...ok, NEXT_PUBLIC_SUPABASE_URL: undefined })).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
  });
});

describe("toUserMessage", () => {
  it("shows AppError messages but hides unknown errors", () => {
    expect(toUserMessage(new AppError("VALIDATION", "Unable to save alumni profile."))).toBe(
      "Unable to save alumni profile.",
    );
    expect(toUserMessage(new Error("relation \"alumni\" does not exist"))).not.toMatch(/relation/);
  });
});
