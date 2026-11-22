import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

export type FmsBrandProps = {
  href?: string
  className?: string
  imageClassName?: string
  showWordmark?: boolean
}

export function FmsBrand({
  href,
  className,
  imageClassName,
  showWordmark = true,
}: FmsBrandProps) {
  const content = (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        alt="FMS Franchise Management"
        className={cn("h-10 w-auto object-contain", imageClassName)}
        height={80}
        priority
        src="/fms.png"
        width={240}
      />
      {!showWordmark && <span className="sr-only">Franchise Management</span>}
    </span>
  )

  return href ? <Link href={href}>{content}</Link> : content
}
