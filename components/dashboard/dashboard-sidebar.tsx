"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ChevronUp,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserRound,
} from "lucide-react"

import { FmsBrand } from "@/components/branding/fms-brand"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { NavigationDestination, NavigationGroup } from "@/lib/navigation"
import { cn } from "@/lib/utils"

import { DashboardNav } from "./dashboard-nav"
import { normalizeNavGroups } from "./nav-utils"
import type { DashboardUser } from "./types"

export type { DashboardUser } from "./types"

type DashboardSidebarProps = {
  groups?: readonly NavigationGroup[]
  items?: readonly NavigationDestination[]
  user?: DashboardUser | null
  onLogout?: () => void
  organizationName?: string
  className?: string
}

const STORAGE_KEY = "dashboard-sidebar-collapsed"

const SIDEBAR_WIDTH = "260px"
const COLLAPSED_WIDTH = "72px"

function getInitials(name?: string | null) {
  if (!name) return "U"

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function DashboardSidebar({
  groups,
  items,
  user,
  onLogout,
  organizationName = "Franchise Management",
  className,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1")
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0")
  }, [collapsed, mounted])

  const navGroups = normalizeNavGroups(groups, items)

  const toggleLabel = collapsed
    ? "Expand sidebar"
    : "Collapse sidebar"

  const ToggleIcon = collapsed
    ? PanelLeftOpen
    : PanelLeftClose

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        aria-label="Primary sidebar"
        data-collapsed={collapsed ? "true" : "false"}
        style={{
          width: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          minWidth: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          maxWidth: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          flex: `0 0 ${collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH}`,
        }}
        className={cn(
          // Desktop sidebar positioning
          "hidden lg:sticky lg:top-0 lg:flex",

          // Strict sidebar dimensions
          "h-[100dvh] min-h-0",

          // Internal flex layout
          "flex-col",

          // Prevent children from expanding sidebar
          "overflow-hidden",

          // Existing appearance
          "border-r border-border/60 bg-card/30",

          // Width transition
          "transition-[width,flex-basis] duration-200 ease-out",

          className
        )}
      >
        {/* HEADER */}
        <header
          className={cn(
            "relative flex h-14 min-h-14 w-full shrink-0",
            "items-center border-b border-border/60",
            collapsed
              ? "justify-center px-2"
              : "justify-between gap-2 px-3"
          )}
        >
          <Link
            href="/dashboard"
            aria-label="Go to dashboard home"
            className={cn(
              "flex min-w-0 items-center rounded-md",
              "focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring",
              collapsed
                ? "justify-center"
                : "flex-1 gap-2"
            )}
          >
            <FmsBrand
              href={undefined}
              showWordmark={false}
              imageClassName={cn(
                "w-auto shrink-0 object-contain",
                "transition-all duration-200",
                collapsed
                  ? "h-8 max-w-[2.5rem]"
                  : "h-8 max-w-[7.5rem]"
              )}
              className="shrink-0"
            />

            {!collapsed && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                  {organizationName}
                </p>

                <p className="truncate text-[11px] text-muted-foreground">
                  Operations
                </p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setCollapsed((value) => !value)}
                  aria-label={toggleLabel}
                >
                  <ToggleIcon
                    className="size-4"
                    aria-hidden="true"
                  />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="right">
                {toggleLabel}
              </TooltipContent>
            </Tooltip>
          )}
        </header>

        {/* NAVIGATION */}
        <nav
          aria-label="Dashboard navigation"
          className={cn(
            "min-h-0 min-w-0 w-full flex-1",
            "overflow-y-auto overflow-x-hidden",
            "overscroll-y-contain",
            "py-4",

            // Hide scrollbar but retain scrolling
            "[scrollbar-width:none]",
            "[&::-webkit-scrollbar]:hidden",

            collapsed ? "px-2" : "px-3"
          )}
        >
          <DashboardNav
            groups={navGroups}
            collapsed={collapsed}
          />
        </nav>

        {/* FOOTER */}
        <footer
          className={cn(
            "w-full shrink-0 space-y-1",
            "border-t border-border/60 p-2"
          )}
        >
          {/* Expand collapsed sidebar */}
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 w-full text-muted-foreground hover:text-foreground"
                  onClick={() => setCollapsed(false)}
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen
                    className="size-4"
                    aria-hidden="true"
                  />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="right">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          )}

          {/* ACCOUNT DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-auto w-full rounded-xl",
                  "hover:bg-muted/60",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  collapsed
                    ? "justify-center px-0 py-2"
                    : "justify-between gap-2 px-2 py-2 text-left"
                )}
                aria-label={
                  collapsed
                    ? user?.name ?? "User menu"
                    : undefined
                }
                title={
                  collapsed
                    ? user?.name ?? "Account"
                    : undefined
                }
              >
                <div
                  className={cn(
                    "flex min-w-0 items-center",
                    collapsed ? "justify-center" : "gap-3"
                  )}
                >
                  <Avatar className="size-8 shrink-0 rounded-lg">
                    {user?.image && (
                      <AvatarImage
                        src={user.image}
                        alt={user.name ?? "User avatar"}
                      />
                    )}

                    <AvatarFallback className="rounded-lg bg-muted text-xs font-medium">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  {!collapsed && (
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium leading-tight">
                        {user?.name ?? "User"}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email ?? "Account"}
                      </p>
                    </div>
                  )}
                </div>

                {!collapsed && (
                  <ChevronUp
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={collapsed ? "right" : "top"}
              align={collapsed ? "end" : "start"}
              className="w-56 rounded-xl"
            >
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">
                  {user?.name ?? "Account"}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <UserRound
                      className="mr-2 size-4"
                      aria-hidden="true"
                    />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings
                      className="mr-2 size-4"
                      aria-hidden="true"
                    />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {onLogout && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={onLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut
                      className="mr-2 size-4"
                      aria-hidden="true"
                    />
                    Sign out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </footer>
      </aside>
    </TooltipProvider>
  )
}

