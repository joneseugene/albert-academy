export type ErrorCode =
  | "VALIDATION" | "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "UPLOAD" | "UNKNOWN";

/** An error whose `userMessage` is safe to show. Technical detail goes in `cause` and logs only. */
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly userMessage: string,
    options?: { cause?: unknown },
  ) {
    super(userMessage, options);
    this.name = "AppError";
  }
}

export function toUserMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  return error instanceof AppError ? error.userMessage : fallback;
}
