import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Building2,
  ClipboardCheck,
  CreditCard,
  Download,
  FileBarChart2,
  FileText,
  Flame,
  FolderOpen,
  GitBranch,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  Map,
  MapPin,
  Radar,
  ScanBarcode,
  ScrollText,
  Settings,
  Shield,
  SparklesIcon,
  Target,
  Upload,
  WalletCards,
  Workflow,
} from "lucide-react"

import type { NavigationDestination, NavigationGroup } from "@/lib/navigation"

const ICONS: Record<string, LucideIcon> = {
  Bell,
  Building2,
  ClipboardCheck,
  CreditCard,
  Download,
  FileBarChart2,
  FileText,
  Flame,
  FolderOpen,
  GitBranch,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  Map,
  MapPin,
  Radar,
  ScanBarcode,
  ScrollText,
  Settings,
  Shield,
  SparklesIcon,
  Target,
  Upload,
  WalletCards,
  Workflow,
}

export function normalizeNavGroups(
  groups?: readonly NavigationGroup[],
  items?: readonly NavigationDestination[],
): readonly NavigationGroup[] {
  if (groups) return groups
  if (items) return [{ label: "Navigation", items }]
  return []
}

export function resolveNavIcon(item: NavigationDestination): LucideIcon {
  if (item.icon) return item.icon
  if (item.iconName && ICONS[item.iconName]) return ICONS[item.iconName]
  return LayoutDashboard
}
