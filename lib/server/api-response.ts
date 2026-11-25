import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, toAppError } from "@lib/server/errors";
import { AuthorizationError, TenantAccessError } from "@lib/server/auth";

export function jsonOk<T>(data: T, init?: number | ResponseInit) {
  const status = typeof init === "number" ? init : init?.status;
  return NextResponse.json(data, typeof init === "number" ? { status: init } : init);
}

export function jsonError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", code: "VALIDATION_ERROR", issues: error.flatten() },
      { status: 422 },
    );
  }
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 403 });
  }
  if (error instanceof TenantAccessError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 403 });
  }
  const appErr = toAppError(error);
  const status = appErr.status >= 400 && appErr.status < 600 ? appErr.status : 500;
  return NextResponse.json({ error: appErr.message, code: appErr.code }, { status });
}
