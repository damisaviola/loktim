import * as Sentry from "@sentry/nextjs";

/**
 * Central utility to log and report application errors to Sentry.
 * Can be called from Server Actions, API routes, or Client components.
 */
export function captureAppError(error: unknown, context?: Record<string, any>) {
  console.error("[Sentry Error Captured]:", error);
  if (context) {
    Sentry.withScope((scope) => {
      scope.setExtras(context);
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}
