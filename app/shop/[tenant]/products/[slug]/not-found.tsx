import Link from "next/link"

export default function NotFound() {
  return (
    <div className="px-4 py-12 text-center sm:px-6">
      <h1 className="text-xl font-semibold tracking-tight">Product not found</h1>
      <p className="mt-3 text-muted-foreground">
        This product is not available in your territory.
      </p>
      <Link
        href={`/shop/${""}`}
        className="mt-6 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
      >
        ← Browse products
      </Link>
    </div>
  )
}
