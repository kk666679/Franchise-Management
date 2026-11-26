import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:py-32">
      <h1 className="text-3xl font-semibold tracking-tight">Store not found</h1>
      <p className="mt-3 text-muted-foreground">
        The requested tenant storefront could not be resolved.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-shadow">
          Return home
        </Link>
      </div>
    </div>
  )
}
