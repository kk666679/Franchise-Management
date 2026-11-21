/**
 * Role-Based Access Control (RBAC) definitions.
 *
 * Single source of truth for the platform's roles, the permission catalog, and
 * the default role → permission grants. Pure data + types (no runtime deps) so
 * it can be imported by the server (authorization checks) and the seed script.
 *
 * Authorization is ALWAYS enforced on the server. These definitions drive the
 * `assertPermission()` / `hasPermission()` helpers in `lib/server/auth/*`.
 */

export const ROLES = [
  "SUPER_ADMIN",
  "PLATFORM_ADMIN",
  "GROUP_ADMIN",
  "BRAND_ADMIN",
  "REGIONAL_MANAGER",
  "AREA_MANAGER",
  "FRANCHISE_OWNER",
  "BRANCH_MANAGER",
  "FINANCE_MANAGER",
  "OPERATIONS_MANAGER",
  "HR_MANAGER",
  "EMPLOYEE",
  "AUDITOR",
] as const

export type RoleCode = (typeof ROLES)[number]

export type RoleScope =
  | "PLATFORM"
  | "GROUP"
  | "BRAND"
  | "REGION"
  | "AREA"
  | "FRANCHISE"
  | "BRANCH"
  | "ORGANIZATION"

export interface RoleDefinition {
  code: RoleCode
  name: string
  description: string
  /** Default scoping level at which this role operates. */
  scope: RoleScope
  /** System roles cannot be deleted or renamed by tenants. */
  system: boolean
}

export const ROLE_DEFINITIONS: Record<RoleCode, RoleDefinition> = {
  SUPER_ADMIN: {
    code: "SUPER_ADMIN",
    name: "Super Administrator",
    description: "Full platform control across every tenant and organization.",
    scope: "PLATFORM",
    system: true,
  },
  PLATFORM_ADMIN: {
    code: "PLATFORM_ADMIN",
    name: "Platform Administrator",
    description: "Manages platform configuration, organizations, and integrations.",
    scope: "PLATFORM",
    system: true,
  },
  GROUP_ADMIN: {
    code: "GROUP_ADMIN",
    name: "Group Administrator",
    description: "Administers a franchise group and all brands beneath it.",
    scope: "GROUP",
    system: false,
  },
  BRAND_ADMIN: {
    code: "BRAND_ADMIN",
    name: "Brand Administrator",
    description: "Administers a single brand: franchisees, regions, and branches.",
    scope: "BRAND",
    system: false,
  },
  REGIONAL_MANAGER: {
    code: "REGIONAL_MANAGER",
    name: "Regional Manager",
    description: "Oversees performance and compliance for a region.",
    scope: "REGION",
    system: false,
  },
  AREA_MANAGER: {
    code: "AREA_MANAGER",
    name: "Area Manager",
    description: "Oversees a set of branches within an area.",
    scope: "AREA",
    system: false,
  },
  FRANCHISE_OWNER: {
    code: "FRANCHISE_OWNER",
    name: "Franchise Owner",
    description: "Owns and operates one or more franchised outlets.",
    scope: "FRANCHISE",
    system: false,
  },
  BRANCH_MANAGER: {
    code: "BRANCH_MANAGER",
    name: "Branch Manager",
    description: "Manages day-to-day operations of a single branch.",
    scope: "BRANCH",
    system: false,
  },
  FINANCE_MANAGER: {
    code: "FINANCE_MANAGER",
    name: "Finance Manager",
    description: "Manages invoicing, royalties, payments, and financial reporting.",
    scope: "ORGANIZATION",
    system: false,
  },
  OPERATIONS_MANAGER: {
    code: "OPERATIONS_MANAGER",
    name: "Operations Manager",
    description: "Manages SOPs, inspections, compliance, and corrective actions.",
    scope: "ORGANIZATION",
    system: false,
  },
  HR_MANAGER: {
    code: "HR_MANAGER",
    name: "HR Manager",
    description: "Manages employees, departments, leave, and payroll integration.",
    scope: "ORGANIZATION",
    system: false,
  },
  EMPLOYEE: {
    code: "EMPLOYEE",
    name: "Employee",
    description: "Branch-level staff with access to assigned operational tasks.",
    scope: "BRANCH",
    system: false,
  },
  AUDITOR: {
    code: "AUDITOR",
    name: "Auditor",
    description: "Read-only access for audit, compliance, and financial review.",
    scope: "ORGANIZATION",
    system: false,
  },
}

/**
 * Permission catalog. Codes follow the convention `module:resource:action`
 * (the trailing `:action` is optional for module-level grants).
 */
export const PERMISSIONS = {
  ORG_READ: "org:read",
  ORG_WRITE: "org:write",
  ORG_DELETE: "org:delete",
  FRANCHISE_READ: "franchise:read",
  FRANCHISE_WRITE: "franchise:write",
  FRANCHISE_APPLICATION_REVIEW: "franchise:application:review",
  FRANCHISE_AGREEMENT_MANAGE: "franchise:agreement:manage",
  BRAND_READ: "brand:read",
  BRAND_WRITE: "brand:write",
  BRANCH_READ: "branch:read",
  BRANCH_WRITE: "branch:write",
  FINANCE_READ: "finance:read",
  FINANCE_INVOICE_WRITE: "finance:invoice:write",
  FINANCE_PAYMENT_WRITE: "finance:payment:write",
  FINANCE_ROYALTY_CALCULATE: "finance:royalty:calculate",
  FINANCE_ROYALTY_APPROVE: "finance:royalty:approve",
  FINANCE_REFUND_APPROVE: "finance:refund:approve",
  SALES_READ: "sales:read",
  SALES_WRITE: "sales:write",
  POS_INTEGRATION_MANAGE: "sales:pos:manage",
  INVENTORY_READ: "inventory:read",
  INVENTORY_WRITE: "inventory:write",
  PROCUREMENT_READ: "procurement:read",
  PROCUREMENT_PO_WRITE: "procurement:po:write",
  PROCUREMENT_PO_APPROVE: "procurement:po:approve",
  SUPPLIER_MANAGE: "procurement:supplier:manage",
  HR_READ: "hr:read",
  HR_WRITE: "hr:write",
  PAYROLL_ACCESS: "hr:payroll:access",
  OPERATIONS_READ: "operations:read",
  OPERATIONS_WRITE: "operations:write",
  INSPECTION_MANAGE: "compliance:inspection:manage",
  CORRECTIVE_ACTION_MANAGE: "compliance:corrective:manage",
  KNOWLEDGE_READ: "knowledge:read",
  KNOWLEDGE_MANAGE: "knowledge:manage",
  DOCUMENT_READ: "document:read",
  DOCUMENT_UPLOAD: "document:upload",
  DOCUMENT_DELETE: "document:delete",
  USER_READ: "user:read",
  USER_MANAGE: "user:manage",
  ROLE_MANAGE: "rbac:role:manage",
  AUDIT_READ: "audit:read",
  SETTINGS_MANAGE: "settings:manage",
  AI_ASSISTANT_USE: "ai:assistant:use",
} as const

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export interface PermissionDefinition {
  code: PermissionCode
  name: string
  category: string
  description: string
}

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  { code: PERMISSIONS.ORG_READ, name: "View organizations", category: "Platform", description: "Read organization and tenant configuration." },
  { code: PERMISSIONS.ORG_WRITE, name: "Manage organizations", category: "Platform", description: "Create and update organizations, groups, and settings." },
  { code: PERMISSIONS.ORG_DELETE, name: "Delete organizations", category: "Platform", description: "Soft-delete organizations (super admin only)." },
  { code: PERMISSIONS.FRANCHISE_READ, name: "View franchises", category: "Franchise", description: "Read franchisee records and lifecycle data." },
  { code: PERMISSIONS.FRANCHISE_WRITE, name: "Manage franchises", category: "Franchise", description: "Create and update franchise records and territories." },
  { code: PERMISSIONS.FRANCHISE_APPLICATION_REVIEW, name: "Review applications", category: "Franchise", description: "Approve or reject franchise applications." },
  { code: PERMISSIONS.FRANCHISE_AGREEMENT_MANAGE, name: "Manage agreements", category: "Franchise", description: "Create, renew, and terminate franchise agreements." },
  { code: PERMISSIONS.BRAND_READ, name: "View brands", category: "Hierarchy", description: "Read brand, region, and area data." },
  { code: PERMISSIONS.BRAND_WRITE, name: "Manage brands", category: "Hierarchy", description: "Create and update brands, regions, and areas." },
  { code: PERMISSIONS.BRANCH_READ, name: "View branches", category: "Hierarchy", description: "Read branch and outlet data." },
  { code: PERMISSIONS.BRANCH_WRITE, name: "Manage branches", category: "Hierarchy", description: "Create and update branches and outlet settings." },
  { code: PERMISSIONS.FINANCE_READ, name: "View finance", category: "Finance", description: "Read invoices, payments, royalties, and statements." },
  { code: PERMISSIONS.FINANCE_INVOICE_WRITE, name: "Manage invoices", category: "Finance", description: "Create and edit invoices and credit notes." },
  { code: PERMISSIONS.FINANCE_PAYMENT_WRITE, name: "Record payments", category: "Finance", description: "Record and reconcile payments." },
  { code: PERMISSIONS.FINANCE_ROYALTY_CALCULATE, name: "Calculate royalties", category: "Finance", description: "Run royalty calculations for a period." },
  { code: PERMISSIONS.FINANCE_ROYALTY_APPROVE, name: "Approve royalties", category: "Finance", description: "Approve and post royalty invoices." },
  { code: PERMISSIONS.FINANCE_REFUND_APPROVE, name: "Approve refunds", category: "Finance", description: "Approve refunds and credit notes." },
  { code: PERMISSIONS.SALES_READ, name: "View sales", category: "Sales", description: "Read sales transactions and performance." },
  { code: PERMISSIONS.SALES_WRITE, name: "Manage sales", category: "Sales", description: "Create and adjust sales records." },
  { code: PERMISSIONS.POS_INTEGRATION_MANAGE, name: "Manage POS integrations", category: "Sales", description: "Configure POS adapters and webhook ingestion." },
  { code: PERMISSIONS.INVENTORY_READ, name: "View inventory", category: "Inventory", description: "Read stock levels, movements, and valuation." },
  { code: PERMISSIONS.INVENTORY_WRITE, name: "Manage inventory", category: "Inventory", description: "Adjust stock and record movements." },
  { code: PERMISSIONS.PROCUREMENT_READ, name: "View procurement", category: "Procurement", description: "Read purchase orders and supplier data." },
  { code: PERMISSIONS.PROCUREMENT_PO_WRITE, name: "Manage purchase orders", category: "Procurement", description: "Create and edit purchase orders." },
  { code: PERMISSIONS.PROCUREMENT_PO_APPROVE, name: "Approve purchase orders", category: "Procurement", description: "Approve purchase orders within authorization limits." },
  { code: PERMISSIONS.SUPPLIER_MANAGE, name: "Manage suppliers", category: "Procurement", description: "Register and verify suppliers." },
  { code: PERMISSIONS.HR_READ, name: "View HR", category: "Human Resources", description: "Read employee directory and records." },
  { code: PERMISSIONS.HR_WRITE, name: "Manage HR", category: "Human Resources", description: "Create and update employees, departments, and leave." },
  { code: PERMISSIONS.PAYROLL_ACCESS, name: "Access payroll", category: "Human Resources", description: "View and process payroll integration data." },
  { code: PERMISSIONS.OPERATIONS_READ, name: "View operations", category: "Operations", description: "Read SOPs, checklists, and operational data." },
  { code: PERMISSIONS.OPERATIONS_WRITE, name: "Manage operations", category: "Operations", description: "Create and update SOPs and checklists." },
  { code: PERMISSIONS.INSPECTION_MANAGE, name: "Manage inspections", category: "Compliance", description: "Schedule and complete branch inspections." },
  { code: PERMISSIONS.CORRECTIVE_ACTION_MANAGE, name: "Manage corrective actions", category: "Compliance", description: "Create and resolve corrective action plans." },
  { code: PERMISSIONS.KNOWLEDGE_READ, name: "View knowledge base", category: "Learning", description: "Read training materials, courses, and documents." },
  { code: PERMISSIONS.KNOWLEDGE_MANAGE, name: "Manage knowledge base", category: "Learning", description: "Create and version training content and courses." },
  { code: PERMISSIONS.DOCUMENT_READ, name: "View documents", category: "Documents", description: "Read and download documents." },
  { code: PERMISSIONS.DOCUMENT_UPLOAD, name: "Upload documents", category: "Documents", description: "Upload documents to object storage." },
  { code: PERMISSIONS.DOCUMENT_DELETE, name: "Delete documents", category: "Documents", description: "Delete documents (soft-delete)." },
  { code: PERMISSIONS.USER_READ, name: "View users", category: "Admin", description: "Read user accounts and sessions." },
  { code: PERMISSIONS.USER_MANAGE, name: "Manage users", category: "Admin", description: "Invite, suspend, and assign roles to users." },
  { code: PERMISSIONS.ROLE_MANAGE, name: "Manage roles", category: "Admin", description: "Create and edit roles and permission grants." },
  { code: PERMISSIONS.AUDIT_READ, name: "View audit logs", category: "Admin", description: "Read audit trail and login history." },
  { code: PERMISSIONS.SETTINGS_MANAGE, name: "Manage settings", category: "Admin", description: "Configure tenant and system settings." },
  { code: PERMISSIONS.AI_ASSISTANT_USE, name: "Use AI assistant", category: "AI", description: "Access the Franchise Intelligence Assistant." },
]

const ALL = PERMISSION_CATALOG.map((p) => p.code) as PermissionCode[]

/**
 * Default role → permission grants (least privilege).
 *
 * Platform roles receive the full catalog; tenant- and branch-scoped roles
 * receive targeted subsets. Seeded into the database and extendable per tenant
 * via custom roles.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<RoleCode, PermissionCode[]> = {
  SUPER_ADMIN: ALL,
  PLATFORM_ADMIN: ALL,
  GROUP_ADMIN: [
    PERMISSIONS.ORG_READ, PERMISSIONS.FRANCHISE_READ, PERMISSIONS.FRANCHISE_WRITE,
    PERMISSIONS.FRANCHISE_APPLICATION_REVIEW, PERMISSIONS.FRANCHISE_AGREEMENT_MANAGE,
    PERMISSIONS.BRAND_READ, PERMISSIONS.BRAND_WRITE, PERMISSIONS.BRANCH_READ,
    PERMISSIONS.BRANCH_WRITE, PERMISSIONS.FINANCE_READ, PERMISSIONS.SALES_READ,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.PROCUREMENT_READ, PERMISSIONS.HR_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.KNOWLEDGE_READ, PERMISSIONS.KNOWLEDGE_MANAGE,
    PERMISSIONS.DOCUMENT_READ, PERMISSIONS.DOCUMENT_UPLOAD, PERMISSIONS.USER_READ,
    PERMISSIONS.USER_MANAGE, PERMISSIONS.AUDIT_READ, PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],
  BRAND_ADMIN: [
    PERMISSIONS.FRANCHISE_READ, PERMISSIONS.FRANCHISE_WRITE,
    PERMISSIONS.FRANCHISE_APPLICATION_REVIEW, PERMISSIONS.FRANCHISE_AGREEMENT_MANAGE,
    PERMISSIONS.BRAND_READ, PERMISSIONS.BRAND_WRITE, PERMISSIONS.BRANCH_READ,
    PERMISSIONS.BRANCH_WRITE, PERMISSIONS.FINANCE_READ, PERMISSIONS.SALES_READ,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.PROCUREMENT_READ, PERMISSIONS.HR_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.INSPECTION_MANAGE,
    PERMISSIONS.CORRECTIVE_ACTION_MANAGE, PERMISSIONS.KNOWLEDGE_READ,
    PERMISSIONS.KNOWLEDGE_MANAGE, PERMISSIONS.DOCUMENT_READ, PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.USER_READ, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  REGIONAL_MANAGER: [
    PERMISSIONS.FRANCHISE_READ, PERMISSIONS.BRAND_READ, PERMISSIONS.BRANCH_READ,
    PERMISSIONS.FINANCE_READ, PERMISSIONS.SALES_READ, PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.INSPECTION_MANAGE,
    PERMISSIONS.CORRECTIVE_ACTION_MANAGE, PERMISSIONS.KNOWLEDGE_READ,
    PERMISSIONS.DOCUMENT_READ, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  AREA_MANAGER: [
    PERMISSIONS.BRANCH_READ, PERMISSIONS.SALES_READ, PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.INSPECTION_MANAGE,
    PERMISSIONS.CORRECTIVE_ACTION_MANAGE, PERMISSIONS.KNOWLEDGE_READ,
    PERMISSIONS.DOCUMENT_READ, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  FRANCHISE_OWNER: [
    PERMISSIONS.FRANCHISE_READ, PERMISSIONS.FRANCHISE_AGREEMENT_MANAGE,
    PERMISSIONS.BRANCH_READ, PERMISSIONS.FINANCE_READ, PERMISSIONS.SALES_READ,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.PROCUREMENT_READ,
    PERMISSIONS.PROCUREMENT_PO_WRITE, PERMISSIONS.HR_READ, PERMISSIONS.HR_WRITE,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.KNOWLEDGE_READ, PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_UPLOAD, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  BRANCH_MANAGER: [
    PERMISSIONS.BRANCH_READ, PERMISSIONS.SALES_READ, PERMISSIONS.SALES_WRITE,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_WRITE,
    PERMISSIONS.PROCUREMENT_READ, PERMISSIONS.PROCUREMENT_PO_WRITE,
    PERMISSIONS.HR_READ, PERMISSIONS.OPERATIONS_READ, PERMISSIONS.INSPECTION_MANAGE,
    PERMISSIONS.CORRECTIVE_ACTION_MANAGE, PERMISSIONS.KNOWLEDGE_READ,
    PERMISSIONS.DOCUMENT_READ, PERMISSIONS.DOCUMENT_UPLOAD, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  FINANCE_MANAGER: [
    PERMISSIONS.ORG_READ, PERMISSIONS.FRANCHISE_READ, PERMISSIONS.BRANCH_READ,
    PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_INVOICE_WRITE,
    PERMISSIONS.FINANCE_PAYMENT_WRITE, PERMISSIONS.FINANCE_ROYALTY_CALCULATE,
    PERMISSIONS.FINANCE_ROYALTY_APPROVE, PERMISSIONS.FINANCE_REFUND_APPROVE,
    PERMISSIONS.SALES_READ, PERMISSIONS.PROCUREMENT_READ, PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.AUDIT_READ, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  OPERATIONS_MANAGER: [
    PERMISSIONS.FRANCHISE_READ, PERMISSIONS.BRAND_READ, PERMISSIONS.BRANCH_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.OPERATIONS_WRITE,
    PERMISSIONS.INSPECTION_MANAGE, PERMISSIONS.CORRECTIVE_ACTION_MANAGE,
    PERMISSIONS.KNOWLEDGE_READ, PERMISSIONS.KNOWLEDGE_MANAGE,
    PERMISSIONS.DOCUMENT_READ, PERMISSIONS.DOCUMENT_UPLOAD, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  HR_MANAGER: [
    PERMISSIONS.ORG_READ, PERMISSIONS.BRANCH_READ, PERMISSIONS.HR_READ,
    PERMISSIONS.HR_WRITE, PERMISSIONS.PAYROLL_ACCESS, PERMISSIONS.KNOWLEDGE_READ,
    PERMISSIONS.DOCUMENT_READ, PERMISSIONS.DOCUMENT_UPLOAD, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  EMPLOYEE: [
    PERMISSIONS.BRANCH_READ, PERMISSIONS.SALES_READ, PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.KNOWLEDGE_READ, PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],
  AUDITOR: [
    PERMISSIONS.ORG_READ, PERMISSIONS.FRANCHISE_READ, PERMISSIONS.BRAND_READ,
    PERMISSIONS.BRANCH_READ, PERMISSIONS.FINANCE_READ, PERMISSIONS.SALES_READ,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.PROCUREMENT_READ, PERMISSIONS.HR_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.KNOWLEDGE_READ, PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.AUDIT_READ, PERMISSIONS.AI_ASSISTANT_USE,
  ],
}

/** Returns the human-readable definition for a role code. */
export function getRoleDefinition(code: RoleCode): RoleDefinition {
  return ROLE_DEFINITIONS[code]
}

/** Returns true when the granted set includes the required permission. */
export function permissionIsGranted(
  granted: ReadonlySet<PermissionCode> | readonly PermissionCode[],
  required: PermissionCode,
): boolean {
  if ("has" in granted) return granted.has(required)
  return (granted as readonly PermissionCode[]).includes(required)
}

// ─────────────────────────────────────────────────────────────────────────────
// Canonical persisted role.
//
// `MembershipRole` mirrors the enum in prisma/schema.prisma (owned by the data
// layer). A user's authorization is derived by expanding their persisted
// MembershipRole into the fine-grained permission set below. The richer 13-role
// functional catalog above (RoleCode / ROLE_DEFINITIONS) is the target model;
// until the schema is extended it maps onto these five persisted roles.
// ─────────────────────────────────────────────────────────────────────────────
export const MEMBERSHIP_ROLES = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "STAFF",
  "VIEWER",
] as const

export type MembershipRole = (typeof MEMBERSHIP_ROLES)[number]

export const MEMBERSHIP_ROLE_DEFINITIONS: Record<
  MembershipRole,
  { name: string; description: string }
> = {
  OWNER: {
    name: "Owner",
    description: "Full control of the organization, including billing and member management.",
  },
  ADMIN: {
    name: "Administrator",
    description: "Manages franchise operations, finance, and configuration within the organization.",
  },
  MANAGER: {
    name: "Manager",
    description: "Manages day-to-day branch/area operations, compliance, and staff.",
  },
  STAFF: {
    name: "Staff",
    description: "Operational staff with access to assigned tasks and read-only business data.",
  },
  VIEWER: {
    name: "Viewer",
    description: "Read-only access for auditors and observers.",
  },
}

/** Expands a persisted MembershipRole into its fine-grained permission set. */
export const MEMBERSHIP_ROLE_PERMISSIONS: Record<MembershipRole, PermissionCode[]> = {
  OWNER: ALL,
  ADMIN: [
    PERMISSIONS.ORG_READ, PERMISSIONS.ORG_WRITE,
    PERMISSIONS.FRANCHISE_READ, PERMISSIONS.FRANCHISE_WRITE,
    PERMISSIONS.FRANCHISE_APPLICATION_REVIEW, PERMISSIONS.FRANCHISE_AGREEMENT_MANAGE,
    PERMISSIONS.BRAND_READ, PERMISSIONS.BRAND_WRITE, PERMISSIONS.BRANCH_READ,
    PERMISSIONS.BRANCH_WRITE, PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_INVOICE_WRITE,
    PERMISSIONS.FINANCE_PAYMENT_WRITE, PERMISSIONS.FINANCE_ROYALTY_CALCULATE,
    PERMISSIONS.FINANCE_ROYALTY_APPROVE, PERMISSIONS.FINANCE_REFUND_APPROVE,
    PERMISSIONS.SALES_READ, PERMISSIONS.SALES_WRITE, PERMISSIONS.POS_INTEGRATION_MANAGE,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_WRITE, PERMISSIONS.PROCUREMENT_READ,
    PERMISSIONS.PROCUREMENT_PO_WRITE, PERMISSIONS.PROCUREMENT_PO_APPROVE,
    PERMISSIONS.SUPPLIER_MANAGE, PERMISSIONS.HR_READ, PERMISSIONS.HR_WRITE,
    PERMISSIONS.PAYROLL_ACCESS, PERMISSIONS.OPERATIONS_READ, PERMISSIONS.OPERATIONS_WRITE,
    PERMISSIONS.INSPECTION_MANAGE, PERMISSIONS.CORRECTIVE_ACTION_MANAGE,
    PERMISSIONS.KNOWLEDGE_READ, PERMISSIONS.KNOWLEDGE_MANAGE, PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_UPLOAD, PERMISSIONS.DOCUMENT_DELETE, PERMISSIONS.USER_READ,
    PERMISSIONS.USER_MANAGE, PERMISSIONS.ROLE_MANAGE, PERMISSIONS.AUDIT_READ,
    PERMISSIONS.SETTINGS_MANAGE, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  MANAGER: [
    PERMISSIONS.FRANCHISE_READ, PERMISSIONS.BRAND_READ, PERMISSIONS.BRANCH_READ,
    PERMISSIONS.BRANCH_WRITE, PERMISSIONS.FINANCE_READ, PERMISSIONS.SALES_READ,
    PERMISSIONS.SALES_WRITE, PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_WRITE,
    PERMISSIONS.PROCUREMENT_READ, PERMISSIONS.PROCUREMENT_PO_WRITE, PERMISSIONS.HR_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.OPERATIONS_WRITE,
    PERMISSIONS.INSPECTION_MANAGE, PERMISSIONS.CORRECTIVE_ACTION_MANAGE,
    PERMISSIONS.KNOWLEDGE_READ, PERMISSIONS.KNOWLEDGE_MANAGE, PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_UPLOAD, PERMISSIONS.USER_READ, PERMISSIONS.AI_ASSISTANT_USE,
  ],
  STAFF: [
    PERMISSIONS.BRANCH_READ, PERMISSIONS.SALES_READ, PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.KNOWLEDGE_READ, PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],
  VIEWER: [
    PERMISSIONS.ORG_READ, PERMISSIONS.FRANCHISE_READ, PERMISSIONS.BRAND_READ,
    PERMISSIONS.BRANCH_READ, PERMISSIONS.FINANCE_READ, PERMISSIONS.SALES_READ,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.PROCUREMENT_READ, PERMISSIONS.HR_READ,
    PERMISSIONS.OPERATIONS_READ, PERMISSIONS.KNOWLEDGE_READ, PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.AUDIT_READ, PERMISSIONS.AI_ASSISTANT_USE,
  ],
}

/** Returns the resolved permission set for a persisted membership role. */
export function permissionsForMembershipRole(
  role: MembershipRole,
): ReadonlySet<PermissionCode> {
  return new Set(MEMBERSHIP_ROLE_PERMISSIONS[role])
}
