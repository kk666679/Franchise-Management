# ADR 0001: Authentication Route Boundaries

- Status: Accepted
- Date: 2026-11-26
- Related paths: `app/api/auth/*`, `app/auth/*`, `lib/server/auth/*`

## Context

Authentication-related routes exist under both `app/api/auth/*` and `app/auth/*`. They can look duplicated, but they serve different runtime boundaries:

| Route | Kind | Responsibility |
| --- | --- | --- |
| `app/api/auth/magic-link/route.ts` | API route | `POST` issues/sends a magic link; `GET` redirects to the browser verify callback. Returns JSON/generic success for API callers where applicable. |
| `app/auth/magic-link/verify/route.ts` | Browser callback | `GET` consumes the magic-link token, creates the session cookie, and redirects to `/dashboard` or login error. |
| `app/api/auth/password-reset/route.ts` | API route | `POST` issues/sends a password reset email with generic success response. |
| `app/api/auth/password-reset/consume/route.ts` | API route | `POST` validates token and new password, then consumes the reset token. |
| `app/auth/password-reset/verify/route.ts` | Browser callback | `GET` forwards a reset token to `/login?resetToken=...` or an invalid-link error. |

The canonical session implementation is the custom JWT cookie flow in `lib/server/auth/session.ts`. Auth helpers live under `lib/server/auth/*`; API routes and browser callbacks should be thin adapters over those helpers.

## Decision

Use `app/api/auth/*` as the canonical namespace for programmatic authentication endpoints. Keep `app/auth/*` only for browser-facing redirect/callback routes that must land in UI or set/read browser navigation state as part of an HTML redirect flow.

Do not treat `app/auth/*` and `app/api/auth/*` as duplicates by path name alone. Before adding or removing an auth route, classify it by boundary:

- **API route (`app/api/auth/*`)**: JSON request/response, machine-consumable actions, CSRF-aware server-side operations, no UI rendering. Examples: issue magic link, request password reset, consume reset token.
- **Browser callback (`app/auth/*`)**: user clicked an email link or needs a browser redirect/cookie-setting response. Keep minimal; delegate token/session logic to `lib/server/auth/*`.
- **Server auth logic (`lib/server/auth/*`)**: token creation/consumption, session signing/verification, password hashing, permission/organization context. This is the source of truth; routes should not duplicate it.

## Rules For Future Development

1. **New auth action?** Put programmatic handlers in `app/api/auth/<action>/route.ts` unless it is strictly a browser callback.
2. **New email-link callback?** Put browser redirect handlers in `app/auth/<flow>/<step>/route.ts` and keep them thin. The email URL should target the intended browser callback; API routes may redirect to that callback for compatibility.
3. **No duplicate business logic.** Token issuance, token hashing/consumption, session creation, cookie options, and permission checks belong in `lib/server/auth/*` or server services, not copied across routes.
4. **Session cookies are server-only.** Only server code may create/set session cookies via `createSessionToken`/`sessionCookieOptions` from `lib/server/auth/session.ts`. Do not expose secrets to client components.
5. **Generic responses for sensitive flows.** Magic-link and password-reset request endpoints should avoid leaking account existence or configuration details, matching existing behavior.
6. **Authorization is server-side.** Route presence or UI visibility is not authorization. Protected operations must check session/org/permission context on the server.
7. **Document new auth routes.** When adding an auth route, update this ADR table or add a follow-up ADR if the boundary changes.

## Consequences

- Positive: Clear separation between JSON APIs and browser callbacks; less accidental removal of cookie-setting callback routes; easier security review.
- Positive: Shared auth logic remains centralized in `lib/server/auth/*`.
- Tradeoff: Two auth route trees require explicit naming discipline. Developers must check both locations before concluding a route is unused.
- Follow-up: If NextAuth or another provider is introduced, add an ADR that defines how provider routes coexist with or replace the custom session flow. `lib/server/auth/config.ts` currently contains NextAuth options, but the active app routes documented here use the custom session flow.
