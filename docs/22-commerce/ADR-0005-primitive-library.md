# ADR-0005: Primitive library strategy

- Status: Accepted
- Date: 2026-11-26
- Related paths: `components/commerce/ui/*`, `components/ui/*`, `eslint.config.mjs`

## Decision

**Base UI only inside `app/shop/**` and `components/commerce/**`. Radix everywhere else.**

## Enforcement

```js
// eslint.config.mjs — import/no-restricted-paths
{
  target: './components/{ui,form,data,chart,shell}/**',
  from: '@base-ui-components/**',
  message: 'Control-plane primitives use Radix, not Base UI. See ADR-0005.',
},
{
  target: './components/commerce/**',
  from: '@radix-ui/**',
  message: 'Commerce primitives use Base UI. See ADR-0005.',
},
```

## Consequences

- Two primitive stacks coexist. This is a feature (matches plane separation), not a bug.
- Each stack must be tested separately (a11y suite per stack).
- `components/commerce/ui/*` holds vendored shadcnstore blocks (Base UI).
- `components/ui/*` holds Radix primitives for the control plane.
