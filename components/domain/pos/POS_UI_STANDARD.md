# POS UI Standard

## Layout
- Primary terminal layout: product/search surface left, cart + tender right on desktop (`lg`+); stack on smaller screens.
- Touch targets are minimum 56x56px for primary actions (tender, qty, add, confirm).
- Money is displayed as formatted currency from integer minor units; never compute with floats in UI state.
- Status surfaces (offline, sync, register) are persistent and visible without scrolling.

## Keyboard-first
- `F2`: Focus product search / barcode input.
- `F4`: Trigger cash tender when tender is enabled.
- `F8`: Trigger card tender when tender is enabled.
- `F9`: Focus primary tender action / open tender confirmation.
- `Esc`: Close dialogs, cancel pickers, or clear transient selection without losing cart.
- `Enter`: Confirm active dialog or add highlighted search result.

## Accessibility
- Every icon-only control has an accessible name.
- Errors use `role="alert"` or live region where appropriate.
- Dialogs trap focus and restore focus on close.
- Status badges include text labels; color is not the only signal.

## Offline / Sync
- Offline state is always visible through `OfflineBanner` or `PosSyncStatus`.
- Mutating actions display pending/synced/failed state; never silently drop failures.
- `clientOpId`/idempotency keys are created before submit and reused on retry.

## Safety
- Void/refund actions require explicit reason and elevated permission confirmation.
- AI/edge signals are advisory; no destructive action is auto-executed.
