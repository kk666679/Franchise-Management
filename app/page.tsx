"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  ChevronRight,
  ClipboardCheck,
  Database,
  DollarSign,
  FileSignature,
  FileText,
  Fingerprint,
  KeyRound,
  Layers,
  Lock,
  Network,
  Plug,
  Scale,
  ShieldCheck,
  ShoppingCart,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { FmsBrand } from "@/components/branding/fms-brand"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { SiteNavigationMenu } from "@/components/layout/site-navigation-menu"

/* ------------------------------------------------------------------ */
/*  Scroll reveal                                                      */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={shown ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition duration-700 ease-out motion-reduce:transition-none",
        shown
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className
      )}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

function SectionHead({
  label,
  title,
  sub,
}: {
  label: string
  title: React.ReactNode
  sub?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
          {label}
        </p>
      </Reveal>
      <Reveal delay={70}>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal delay={140}>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            {sub}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}

const ACCENT = {
  emerald: {
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    bar: "from-emerald-500/80 via-emerald-500/20 to-transparent",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    bar: "from-amber-500/80 via-amber-500/20 to-transparent",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  cyan: {
    chip: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    bar: "from-cyan-500/80 via-cyan-500/20 to-transparent",
    dot: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400",
  },
  violet: {
    chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    bar: "from-violet-500/80 via-violet-500/20 to-transparent",
    dot: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
  },
  rose: {
    chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    bar: "from-rose-500/80 via-rose-500/20 to-transparent",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
  },
} as const

type AccentKey = keyof typeof ACCENT

/* ------------------------------------------------------------------ */
/*  Hero dashboard mockup                                              */
/* ------------------------------------------------------------------ */

const STATS = [
  {
    label: "Total Locations",
    value: "248",
    note: "+12 this quarter",
    tone: "up",
  },
  { label: "Network Revenue", value: "$8.42M", note: "+8.6% MoM", tone: "up" },
  {
    label: "Royalty Collected",
    value: "$672.8K",
    note: "94.7% of $710K billed",
    tone: "neutral",
  },
  {
    label: "Compliance Score",
    value: "94.2%",
    note: "+1.8 pts network-wide",
    tone: "up",
  },
] as const

const BARS = [38, 55, 44, 68, 53, 74, 62, 82, 67, 88, 73, 96]

const ACTIVITY = [
  {
    icon: UserPlus,
    label: "New application",
    detail: "Jordan Lee, Austin TX",
    tint: "text-primary bg-primary/10",
  },
  {
    icon: DollarSign,
    label: "Royalty received",
    detail: "Harbor Coffee #084",
    tint: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    icon: ClipboardCheck,
    label: "Inspection completed",
    detail: "Maya Patel, Portland",
    tint: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
  },
  {
    icon: FileSignature,
    label: "Agreement version",
    detail: "Summit Hospitality v3",
    tint: "text-primary bg-primary/10",
  },
] as const

function DashboardMockup() {
  return (
    <div className="mt-14 overflow-hidden rounded-3xl text-left glass sm:rounded-[2rem]">
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-3 sm:px-5">
        <span className="size-2.5 rounded-full bg-red-500/70" aria-hidden />
        <span className="size-2.5 rounded-full bg-amber-500/70" aria-hidden />
        <span className="size-2.5 rounded-full bg-emerald-500/70" aria-hidden />
        <span className="ml-auto inline-flex min-w-0 items-center gap-1.5 truncate rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary">
          <Lock className="size-3 shrink-0" aria-hidden />
          <span className="truncate">tenant: harbor-coffee · region: west</span>
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <p className="text-sm font-semibold sm:text-base">
          Good morning, Alex.
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Control-plane view · Last 30 days · All amounts in USD
        </p>

        {/* stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border/70 bg-background/50 p-3.5 sm:p-4"
            >
              <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                {s.label}
              </p>
              <p className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                {s.value}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-[11px] font-medium",
                  s.tone === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                )}
              >
                {s.note}
              </p>
            </div>
          ))}
        </div>

        {/* royalty pipeline */}
        <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/50 px-4 py-3 sm:flex-row sm:items-center">
          <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            Royalty cycle
          </span>
          <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="size-3" aria-hidden /> Calculated
            </span>
            <ChevronRight
              className="size-3 text-muted-foreground/60"
              aria-hidden
            />
            <span className="rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[11px] font-medium text-primary">
              Invoiced
            </span>
            <ChevronRight
              className="size-3 text-muted-foreground/60"
              aria-hidden
            />
            <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              Paid
            </span>
          </div>
        </div>

        {/* chart + activity */}
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
            <p className="text-[11px] font-medium text-muted-foreground">
              Network Revenue · Monthly
            </p>
            <div className="mt-4 flex h-24 items-end gap-1.5" aria-hidden>
              {BARS.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/50 to-primary"
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
            <p className="text-[11px] font-medium text-muted-foreground">
              Recent Activity · Immutable Log
            </p>
            <ul className="mt-2 divide-y divide-border/60">
              {ACTIVITY.map((a) => (
                <li
                  key={a.label}
                  className="flex items-start gap-2.5 py-2 text-[11px]"
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-md",
                      a.tint
                    )}
                  >
                    <a.icon className="size-3" aria-hidden />
                  </span>
                  <span className="leading-snug text-muted-foreground">
                    <strong className="font-medium text-foreground">
                      {a.label}
                    </strong>{" "}
                    · {a.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Swipe carousel                                                     */
/* ------------------------------------------------------------------ */

type Slide = {
  icon: LucideIcon
  accent: AccentKey
  title: string
  body: React.ReactNode
  meta: string
}

const SLIDES: Slide[] = [
  {
    icon: Database,
    accent: "emerald",
    title: "Row-Level Security, not application filters",
    body: (
      <>
        <p>
          A single missing{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.78em]">
            WHERE
          </code>{" "}
          clause becomes a cross-tenant data leak. Franchise Management moves
          enforcement into PostgreSQL, where it{" "}
          <strong className="font-medium text-foreground">fails closed</strong>.
        </p>
        <p>
          Shared schema +{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.78em]">
            tenant_id
          </code>{" "}
          on every table. Schema-per-tenant only when a contract or regulator
          demands it.
        </p>
      </>
    ),
    meta: "PostgreSQL RLS · tenant_id on every row",
  },
  {
    icon: Calculator,
    accent: "amber",
    title: "Royalty in basis points",
    body: (
      <>
        <p>
          250 bps = exactly 2.5%.{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.78em]">
            revenue × bps / 10000
          </code>{" "}
          gives integer arithmetic with zero rounding drift.
        </p>
        <p>
          Tiered schedules are first-class, not a scalar on the franchisee
          record.
        </p>
      </>
    ),
    meta: "RoyaltyObligation · tiered schedule support",
  },
  {
    icon: Plug,
    accent: "cyan",
    title: "POS-to-royalty, validated",
    body: (
      <>
        <p>
          Toast, Square, Clover, NCR → adapter → validation engine → royalty
          calculation.
        </p>
        <p>
          Manual uploads are flagged as <em>self-reported</em> until reconciled.
          Data that fails consistency checks is quarantined, not accepted.
        </p>
      </>
    ),
    meta: "Adapter per provider · one normalized sales-event contract",
  },
  {
    icon: Layers,
    accent: "violet",
    title: "Central catalog, bounded local pricing",
    body: (
      <p>
        Franchisees curate what appears in their storefront, but they don’t
        invent products. Pricing lives inside a floor (brand protection) and a
        ceiling (franchisee margin protection) — both enforced server-side, not
        in the UI.
      </p>
    ),
    meta: "ProductCatalog aggregate · price floor / ceiling invariants",
  },
  {
    icon: FileText,
    accent: "rose",
    title: "Immutable audit trail",
    body: (
      <>
        <p>
          Every calculation, payment, permission change, and agreement
          transition is logged with actor, timestamp, and before/after state.
        </p>
        <p>Audit rights are a legal requirement — not a reporting feature.</p>
      </>
    ),
    meta: "Append-only log · segregation of duties",
  },
]

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function CapabilityCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const suppressClick = useRef(false)
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startLeft: 0,
    id: -1,
  })

  const [index, setIndex] = useState(0)
  const [last, setLast] = useState(0)
  const [progress, setProgress] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [dragging, setDragging] = useState(false)

  const metrics = useCallback(() => {
    const track = trackRef.current
    if (!track) return { step: 1, max: 0, last: 0 }
    const slides = Array.from(
      track.querySelectorAll<HTMLElement>("[data-slide]")
    )
    if (slides.length === 0) return { step: 1, max: 0, last: 0 }
    const step =
      slides.length > 1
        ? slides[1].offsetLeft - slides[0].offsetLeft
        : slides[0].clientWidth || 1
    const max = Math.max(0, track.scrollWidth - track.clientWidth)
    const perView = Math.max(1, Math.round(track.clientWidth / step))
    return { step, max, last: Math.max(0, slides.length - perView) }
  }, [])

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { step, max, last: lastIndex } = metrics()
    setIndex(
      Math.min(Math.max(Math.round(track.scrollLeft / step), 0), lastIndex)
    )
    setLast(lastIndex)
    setProgress(max > 0 ? track.scrollLeft / max : 0)
    setAtStart(track.scrollLeft <= 2)
    setAtEnd(track.scrollLeft >= max - 2)
  }, [metrics])

  const goTo = useCallback(
    (target: number, smooth = true) => {
      const track = trackRef.current
      if (!track) return
      const { step, max, last: lastIndex } = metrics()
      const i = Math.min(Math.max(target, 0), lastIndex)
      track.scrollTo({
        left: Math.min(i * step, max),
        behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto",
      })
    },
    [metrics]
  )

  useEffect(() => {
    sync()
    const track = trackRef.current
    if (!track) return
    const onResize = () => sync()
    window.addEventListener("resize", onResize)
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null
    ro?.observe(track)
    document.fonts?.ready.then(sync).catch(() => {})
    return () => {
      window.removeEventListener("resize", onResize)
      ro?.disconnect()
    }
  }, [sync])

  const onScroll = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      sync()
    })
  }, [sync])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      goTo(index + 1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      goTo(index - 1)
    }
  }

  /* Drag with mouse / pen only — touch keeps native momentum + snapping */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return
    if (e.pointerType === "mouse" && e.button !== 0) return
    const track = trackRef.current
    if (!track) return
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startLeft: track.scrollLeft,
      id: e.pointerId,
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const track = trackRef.current
    if (!d.active || !track) return
    const dx = e.clientX - d.startX
    if (!d.moved) {
      if (Math.abs(dx) < 6) return // threshold keeps plain clicks working
      d.moved = true
      setDragging(true)
      try {
        track.setPointerCapture(d.id)
      } catch {
        /* no-op */
      }
    }
    e.preventDefault()
    track.scrollLeft = d.startLeft - dx
  }

  const endDrag = () => {
    const d = drag.current
    const track = trackRef.current
    if (!d.active) return
    d.active = false
    if (track) {
      try {
        track.releasePointerCapture(d.id)
      } catch {
        /* no-op */
      }
    }
    if (!d.moved) return
    d.moved = false
    setDragging(false)
    if (track) goTo(Math.round(track.scrollLeft / metrics().step), false)
    suppressClick.current = true
    window.setTimeout(() => {
      suppressClick.current = false
    }, 300)
  }

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return
    suppressClick.current = false
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Platform capabilities"
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className={cn(
          "flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain rounded-3xl px-0.5 pb-2",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          dragging
            ? "cursor-grabbing snap-none [scroll-behavior:auto] select-none"
            : "cursor-grab"
        )}
      >
        {SLIDES.map((slide, i) => {
          const accent = ACCENT[slide.accent]
          return (
            <article
              key={slide.title}
              data-slide="true"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              className={cn(
                "relative flex shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm transition-colors sm:p-7",
                "basis-[86%] sm:basis-[calc(50%-0.625rem)] lg:basis-[calc(33.333%-0.834rem)]",
                "hover:border-border"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-gradient-to-r",
                  accent.bar
                )}
              />
              <span className="absolute top-6 right-6 font-mono text-[11px] tracking-widest text-muted-foreground/50">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span
                className={cn(
                  "grid size-10 place-items-center rounded-xl",
                  accent.chip
                )}
              >
                <slide.icon className="size-4" aria-hidden />
              </span>

              <h3 className="mt-4 pr-10 text-base font-semibold tracking-tight">
                {slide.title}
              </h3>
              <div className="mt-2 flex-1 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                {slide.body}
              </div>

              <p className="mt-4 border-t border-border/60 pt-3 font-mono text-[11px] text-muted-foreground/70">
                {slide.meta}
              </p>
            </article>
          )
        })}
      </div>

      {/* controls */}
      <div className="mt-5 flex items-center gap-4">
        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Choose slide"
        >
          {SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              role="tab"
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                i > last && "hidden",
                i === index
                  ? "w-6 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>

        <div
          className="hidden h-0.5 max-w-56 flex-1 overflow-hidden rounded-full bg-border sm:block"
          aria-hidden
        >
          <span
            className="block h-full rounded-full bg-gradient-to-r from-primary to-violet-400 transition-[width] duration-150"
            style={{ width: `${Math.max(progress * 100, 4)}%` }}
          />
        </div>

        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous slide"
            disabled={atStart}
            onClick={() => goTo(index - 1)}
            className="rounded-full"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next slide"
            disabled={atEnd}
            onClick={() => goTo(index + 1)}
            className="rounded-full"
          >
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Page() {
  return (
    <div className="relative min-h-svh overflow-x-hidden bg-background text-foreground">
      {/* ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,oklch(0.06_0.01_270/35%)_100%)] opacity-60 dark:opacity-100" />
        <div className="absolute -top-72 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* nav */}
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
                size="sm"
                className="rounded-full px-3 sm:px-4"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full px-3 sm:px-4">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ---------------- hero ---------------- */}
        <section className="mx-auto w-full max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-24">
          <div className="flex flex-col items-center text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <Network className="size-3.5" aria-hidden />
                Two planes. One network. Zero collisions.
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance break-words sm:text-5xl lg:text-6xl">
                The{" "}
                <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
                  control plane
                </span>{" "}
                for franchise networks that also sell online.
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                Franchise Management separates the relationship from the
                transaction — so a checkout surge never locks the royalty
                ledger, and a royalty audit never takes the storefront down.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button asChild className="rounded-full px-6">
                  <Link href="/login">
                    <KeyRound className="size-4" aria-hidden />
                    Log in
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-6">
                  <Link href="/signup">
                    <UserPlus className="size-4" aria-hidden />
                    Create an account
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Press{" "}
                <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono">
                  D
                </kbd>{" "}
                anytime to switch themes
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <DashboardMockup />
          </Reveal>
        </section>

        {/* ---------------- architecture ---------------- */}
        <section
          id="architecture"
          className="border-y border-border/60 bg-muted/20 py-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHead
              label="Built around the real tension"
              title={
                <>
                  Control plane. Commerce plane.
                  <br className="hidden sm:block" /> Never the twain shall block
                  each other.
                </>
              }
              sub="Most platforms collapse the franchise relationship and the storefront into one system. That design always leaks. Franchise Management keeps them separate — sharing a tenant model and a sales feed, but failing independently."
            />

            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              <Reveal>
                <div className="relative h-full overflow-hidden rounded-3xl p-6 glass sm:p-8">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary via-violet-400 to-transparent"
                  />
                  <span className="inline-flex items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-[11px] tracking-wide text-primary uppercase">
                    <ShieldCheck className="size-3" aria-hidden /> Control plane
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">
                    Franchise Management
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The system of record for the <em>relationship</em>.
                    Identity, tenancy, agreements, royalties, compliance,
                    reporting, audit.
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {[
                      "Three-layer tenancy: Franchisor → Territory → Franchisee",
                      "Royalty engine in basis points — integer arithmetic, no drift",
                      "Agreement version transitions, never in-place edits",
                      "Immutable audit trail on every financial mutation",
                      "Segregation of duties: calculate, approve, release",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-primary"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <div className="relative h-full overflow-hidden rounded-3xl p-6 glass sm:p-8">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-500 via-cyan-400 to-transparent"
                  />
                  <span className="inline-flex items-center gap-2 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
                    <ShoppingCart className="size-3" aria-hidden /> Commerce
                    plane
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">
                    E-Commerce Engine
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The system of <em>transaction</em> with the end customer.
                    Catalog, storefront, cart, checkout, payments, fulfillment,
                    returns.
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {[
                      "Headless, tenant-scoped commerce API",
                      "Centralized master catalog with local overrides",
                      "Price floors and ceilings enforced server-side",
                      "Territory attribution stamped at order creation",
                      "Payment routing driven by territory, not post-hoc matching",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <p className="mt-8 text-center font-mono text-xs leading-relaxed text-muted-foreground">
                <span className="text-amber-500">↕</span> order / sales events{" "}
                <span className="text-amber-500">↕</span>
                <span className="mt-1 block text-[11px] opacity-70">
                  Event bus decouples checkout from royalty and reporting —
                  neither plane waits on the other.
                </span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------- features ---------------- */}
        <section id="features" className="py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHead
              label="Everything the network needs"
              title="One platform. Every layer of the franchise."
              sub="From database-enforced isolation to basis-point royalty math, each capability is built for the structural reality of a franchise network — not retrofitted from a single-store tool."
            />

            {/* lead-in: network structure */}
            <Reveal className="mt-14">
              <div className="grid items-center gap-8 overflow-hidden rounded-3xl p-6 glass sm:p-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
                <div>
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Network className="size-4" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">
                    Three-layer tenancy, modeled as first-class data
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Franchisor, territory, and franchisee are not hard-coded
                    assumptions. Directly-operated sites flow through the same
                    permission and finance machinery — no separate code path.
                  </p>
                  <p className="mt-4 border-t border-border/60 pt-3 font-mono text-[11px] text-muted-foreground/70">
                    FranchiseNetwork aggregate · hierarchy integrity enforced
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/30 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 font-medium text-primary">
                      Franchisor / Brand
                    </span>
                    aggregate + drill-down
                  </div>
                  <div className="mt-2 ml-4 space-y-2 border-l border-dashed border-border pl-3">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded-md border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 font-medium text-violet-600 dark:text-violet-400">
                        Territory / Region
                      </span>
                      scoped to assigned franchisees
                    </div>
                    <div className="ml-4 space-y-2 border-l border-dashed border-border pl-3">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-600 dark:text-emerald-400">
                          Franchisee
                        </span>
                        own data only
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* swipe carousel */}
            <Reveal delay={100} className="mt-6">
              <CapabilityCarousel />
            </Reveal>
          </div>
        </section>

        {/* ---------------- security ---------------- */}
        <section
          id="security"
          className="border-y border-border/60 bg-muted/20 py-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHead
              label="Security posture"
              title="Assume the frontend is untrusted"
              sub="Franchise systems concentrate financial P&Ls, employee records, and contractual terms. The controls are not optional add-ons; they are the architecture."
            />

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Fingerprint,
                  title: "SSO / OIDC with MFA",
                  body: "Role-based session claims carry tenant and scope. Every read and write hits a server-side policy check; RLS is the database backstop.",
                },
                {
                  icon: KeyRound,
                  title: "No insecure direct object references",
                  body: null,
                },
                {
                  icon: Scale,
                  title: "Segregation of financial duties",
                  body: "One role calculates. Another approves the invoice. A third releases payment. No single role can both calculate and release — by design, not by convention.",
                },
              ].map((card, i) => (
                <Reveal key={card.title} delay={i * 80}>
                  <div className="h-full rounded-3xl p-6 glass">
                    <card.icon className="size-5 text-primary" aria-hidden />
                    <h3 className="mt-3 text-sm font-semibold tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {card.body ?? (
                        <>
                          Every query verifies the requested record belongs to
                          the caller’s accessible scope.{" "}
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.78em]">
                            tenant_id
                          </code>{" "}
                          and{" "}
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.78em]">
                            franchisee_id
                          </code>{" "}
                          are resolved at the edge — never trusted from the
                          client body.
                        </>
                      )}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- metrics ---------------- */}
        <section className="py-20">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-4 text-center sm:px-6 lg:grid-cols-4">
            {[
              { value: "248", label: "Locations managed" },
              { value: "$8.4M", label: "Network revenue tracked" },
              { value: "94%", label: "Average compliance score" },
              { value: "12 hrs", label: "Saved per week on reporting" },
            ].map((m, i) => (
              <Reveal key={m.label} delay={i * 70}>
                <p className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                  {m.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------- testimonial ---------------- */}
        <section className="border-y border-border/60 bg-muted/20 py-20">
          <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
                Trusted by operators
              </p>
            </Reveal>
            <Reveal delay={80}>
              <blockquote className="mt-6 text-lg leading-relaxed font-medium tracking-tight text-pretty sm:text-xl lg:text-2xl">
                “Before Franchise Management, we were stitching together
                spreadsheets and chasing franchisees for royalty reports. Now I
                open one dashboard and see the entire network — revenue,
                compliance, every transaction attributed to the right territory.
                It’s transformed how we run the business.”
              </blockquote>
            </Reveal>
            <Reveal delay={150}>
              <figcaption className="mt-8 flex items-center justify-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-sm font-semibold text-primary-foreground">
                  MG
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold">
                    Maria Gonzalez
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    COO, Harbor Coffee Group
                  </span>
                </span>
              </figcaption>
            </Reveal>
          </div>
        </section>

        {/* ---------------- cta ---------------- */}
        <section id="cta" className="py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 px-6 py-14 text-center sm:rounded-[2rem] sm:px-10 sm:py-16">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-violet-500/10 blur-3xl"
                />
                <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl">
                  See your network the way it’s actually structured.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-pretty text-muted-foreground">
                  Get a personalized demo with your own hierarchy, royalty
                  schedule, and territory map loaded into the control plane.
                </p>
                <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                  <Button asChild className="rounded-full px-6">
                    <Link href="/login">
                      <KeyRound className="size-4" aria-hidden />
                      Log in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full px-6"
                  >
                    <Link href="/signup">
                      <UserPlus className="size-4" aria-hidden />
                      Sign up
                    </Link>
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Press{" "}
                  <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono">
                    D
                  </kbd>{" "}
                  anytime to switch themes
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------- footer ---------------- */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:flex-row">
          <FmsBrand href="/" imageClassName="h-10 max-w-[9rem]" />

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <a
              href="#architecture"
              className="transition-colors hover:text-foreground"
            >
              Architecture
            </a>
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#security"
              className="transition-colors hover:text-foreground"
            >
              Security
            </a>
          </nav>

          <p className="text-xs text-muted-foreground">
            © 2026 Franchise Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
