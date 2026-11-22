import Link from "next/link"

import { FmsBrand } from "@/components/branding/fms-brand"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteNavigationMenu } from "@/components/layout/site-navigation-menu"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <FmsBrand href="/" imageClassName="h-11 max-w-[10rem]" />
        <div className="flex items-center gap-2">
          <SiteNavigationMenu />
          <ThemeToggle />
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              asChild
              variant="outline"
              className="rounded-full px-3 sm:px-4"
              size="sm"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="rounded-full px-3 sm:px-4" size="sm">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
