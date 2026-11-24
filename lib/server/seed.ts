import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

import { resolveDatabaseUrls } from "@/lib/database-urls"

const { runtimeUrl: databaseUrl } = resolveDatabaseUrls(process.env)

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be configured before seeding")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
  log: ["error"],
})

const SEED_PASSWORD_HASH =
  "$2b$10$rXz9y8k7q6w5v4u3t2s1r0q9p8o7n6m5l4k3j2h1g0f9e8d7c6b5a"

async function main() {
  console.log("Starting comprehensive database seed...")

  // ── 1. Organization ──────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: "franchise-demo" },
    update: {},
    create: {
      name: "Franchise Demo Organization",
      slug: "franchise-demo",
      description: "Seed organization for development and testing",
      websiteUrl: "https://franchise-demo.example.com",
      timezone: "America/New_York",
      currency: "USD",
    },
  })
  console.log(`Organization: ${org.name} (${org.id})`)

  // ── 2. Users ─────────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "owner@franchise-demo.example.com" },
      update: {},
      create: {
        email: "owner@franchise-demo.example.com",
        name: "Organization Owner",
        passwordHash: SEED_PASSWORD_HASH,
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "admin@franchise-demo.example.com" },
      update: {},
      create: {
        email: "admin@franchise-demo.example.com",
        name: "Organization Admin",
        passwordHash: SEED_PASSWORD_HASH,
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "manager@franchise-demo.example.com" },
      update: {},
      create: {
        email: "manager@franchise-demo.example.com",
        name: "Branch Manager",
        passwordHash: SEED_PASSWORD_HASH,
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "staff@franchise-demo.example.com" },
      update: {},
      create: {
        email: "staff@franchise-demo.example.com",
        name: "Front Desk Staff",
        passwordHash: SEED_PASSWORD_HASH,
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "viewer@franchise-demo.example.com" },
      update: {},
      create: {
        email: "viewer@franchise-demo.example.com",
        name: "Read-Only Viewer",
        passwordHash: SEED_PASSWORD_HASH,
        status: "ACTIVE",
      },
    }),
  ])
  console.log(`Users: ${users.length} created`)

  // ── 3. Memberships ───────────────────────────────────────────────
  const memberships = await Promise.all([
    prisma.membership.upsert({
      where: {
        organizationId_userId: { organizationId: org.id, userId: users[0].id },
      },
      update: {},
      create: { organizationId: org.id, userId: users[0].id, role: "OWNER" },
    }),
    prisma.membership.upsert({
      where: {
        organizationId_userId: { organizationId: org.id, userId: users[1].id },
      },
      update: {},
      create: { organizationId: org.id, userId: users[1].id, role: "ADMIN" },
    }),
    prisma.membership.upsert({
      where: {
        organizationId_userId: { organizationId: org.id, userId: users[2].id },
      },
      update: {},
      create: { organizationId: org.id, userId: users[2].id, role: "MANAGER" },
    }),
    prisma.membership.upsert({
      where: {
        organizationId_userId: { organizationId: org.id, userId: users[3].id },
      },
      update: {},
      create: { organizationId: org.id, userId: users[3].id, role: "STAFF" },
    }),
    prisma.membership.upsert({
      where: {
        organizationId_userId: { organizationId: org.id, userId: users[4].id },
      },
      update: {},
      create: { organizationId: org.id, userId: users[4].id, role: "VIEWER" },
    }),
  ])
  console.log(`Memberships: ${memberships.length} created`)

  // ── 4. Franchise Brand ───────────────────────────────────────────
  const brand = await prisma.franchiseBrand.upsert({
    where: {
      organizationId_slug: { organizationId: org.id, slug: "quickbite" },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: "QuickBite Franchise",
      slug: "quickbite",
      description: "Quick-service restaurant franchise brand",
      status: "ACTIVE",
      foundedYear: 2015,
      websiteUrl: "https://quickbite.example.com",
    },
  })
  console.log(`Brand: ${brand.name} (${brand.id})`)

  // ── 5. Franchisee ────────────────────────────────────────────────
  const franchisee = await prisma.franchisee.upsert({
    where: {
      organizationId_registrationNo: {
        organizationId: org.id,
        registrationNo: "REG-2024-001",
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      brandId: brand.id,
      legalName: "Main Street Franchise LLC",
      tradingName: "QuickBite Main Street",
      registrationNo: "REG-2024-001",
      taxId: "12-3456789",
      email: "ops@quickbitemain.example.com",
      phone: "+1-555-0101",
      status: "ACTIVE",
      notes: "Flagship location franchisee",
    },
  })
  console.log(
    `Franchisee: ${franchisee.tradingName ?? franchisee.legalName} (${franchisee.id})`
  )

  // ── 6. Franchisee Contacts ───────────────────────────────────────
  await prisma.franchiseeContact.createMany({
    data: [
      {
        franchiseeId: franchisee.id,
        name: "Sarah Chen",
        email: "sarah@quickbitemain.example.com",
        phone: "+1-555-0102",
        title: "Operations Manager",
        isPrimary: true,
      },
      {
        franchiseeId: franchisee.id,
        name: "Mike Rodriguez",
        email: "mike@quickbitemain.example.com",
        phone: "+1-555-0103",
        title: "Shift Supervisor",
        isPrimary: false,
      },
    ],
    skipDuplicates: true,
  })
  console.log("Franchisee contacts: 2 created")

  // ── 7. Franchise Locations ───────────────────────────────────────
  const locations = await Promise.all([
    prisma.franchiseLocation.upsert({
      where: {
        organizationId_code: { organizationId: org.id, code: "QB-MS-001" },
      },
      update: {},
      create: {
        organizationId: org.id,
        brandId: brand.id,
        franchiseeId: franchisee.id,
        name: "QuickBite Main Street",
        code: "QB-MS-001",
        status: "ACTIVE",
        addressLine1: "123 Main Street",
        addressLine2: "Suite 100",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "US",
        latitude: 30.2672,
        longitude: -97.7431,
        openedAt: new Date("2024-01-15"),
      },
    }),
    prisma.franchiseLocation.upsert({
      where: {
        organizationId_code: { organizationId: org.id, code: "QB-DT-002" },
      },
      update: {},
      create: {
        organizationId: org.id,
        brandId: brand.id,
        franchiseeId: franchisee.id,
        name: "QuickBite Downtown",
        code: "QB-DT-002",
        status: "ACTIVE",
        addressLine1: "456 Congress Avenue",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "US",
        latitude: 30.2675,
        longitude: -97.7428,
        openedAt: new Date("2024-06-01"),
      },
    }),
  ])
  console.log(`Locations: ${locations.length} created`)

  // -- 8. Franchise Application -------------------------------------
  const application = await prisma.franchiseApplication.upsert({
    where: {
      organizationId_referenceNo: {
        organizationId: org.id,
        referenceNo: "APP-2024-001",
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      brandId: brand.id,
      franchiseeId: franchisee.id,
      submittedById: users[0].id,
      status: "APPROVED",
      referenceNo: "APP-2024-001",
      submittedAt: new Date("2024-01-10"),
      reviewedAt: new Date("2024-01-12"),
      decisionNotes: "Approved after review of financials and territory.",
    },
  })
  console.log(`Application: ${application.referenceNo} (${application.id})`)

  // -- 9. Franchise Agreement ---------------------------------------
  const agreement = await prisma.franchiseAgreement.upsert({
    where: {
      organizationId_agreementNo: {
        organizationId: org.id,
        agreementNo: "FA-2024-001",
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      brandId: brand.id,
      franchiseeId: franchisee.id,
      locationId: locations[0].id,
      applicationId: application.id,
      agreementNo: "FA-2024-001",
      status: "ACTIVE",
      signedAt: new Date("2024-01-15"),
      startDate: new Date("2024-02-01"),
      endDate: new Date("2029-01-31"),
      renewalDate: new Date("2028-12-01"),
      initialFee: 50000,
      royaltyRate: 6.0,
      marketingRate: 2.0,
      terms: { territory: "Austin metro area", exclusive: true },
    },
  })
  console.log(`Agreement: ${agreement.agreementNo} (${agreement.id})`)

  // -- 10. Financial Accounts -----------------------------------------
  const accounts = await Promise.all([
    prisma.financialAccount.upsert({
      where: { organizationId_code: { organizationId: org.id, code: "1000" } },
      update: {},
      create: {
        organizationId: org.id,
        code: "1000",
        name: "Cash on Hand",
        type: "ASSET",
        status: "ACTIVE",
      },
    }),
    prisma.financialAccount.upsert({
      where: { organizationId_code: { organizationId: org.id, code: "1100" } },
      update: {},
      create: {
        organizationId: org.id,
        code: "1100",
        name: "Accounts Receivable",
        type: "ASSET",
        status: "ACTIVE",
      },
    }),
    prisma.financialAccount.upsert({
      where: { organizationId_code: { organizationId: org.id, code: "2000" } },
      update: {},
      create: {
        organizationId: org.id,
        code: "2000",
        name: "Accounts Payable",
        type: "LIABILITY",
        status: "ACTIVE",
      },
    }),
    prisma.financialAccount.upsert({
      where: { organizationId_code: { organizationId: org.id, code: "3000" } },
      update: {},
      create: {
        organizationId: org.id,
        code: "3000",
        name: "Owner's Equity",
        type: "EQUITY",
        status: "ACTIVE",
      },
    }),
    prisma.financialAccount.upsert({
      where: { organizationId_code: { organizationId: org.id, code: "4000" } },
      update: {},
      create: {
        organizationId: org.id,
        code: "4000",
        name: "Royalty Income",
        type: "REVENUE",
        status: "ACTIVE",
      },
    }),
    prisma.financialAccount.upsert({
      where: { organizationId_code: { organizationId: org.id, code: "5000" } },
      update: {},
      create: {
        organizationId: org.id,
        code: "5000",
        name: "Operating Expenses",
        type: "EXPENSE",
        status: "ACTIVE",
      },
    }),
  ])
  console.log(`Financial accounts: ${accounts.length} created`)

  // -- 11. Financial Period -------------------------------------------
  const period = await prisma.financialPeriod.upsert({
    where: { organizationId_name: { organizationId: org.id, name: "Q1 2024" } },
    update: {},
    create: {
      organizationId: org.id,
      name: "Q1 2024",
      startsAt: new Date("2024-01-01"),
      endsAt: new Date("2024-03-31"),
      status: "OPEN",
    },
  })
  console.log(`Financial period: ${period.name} (${period.id})`)

  // -- 12. Invoices ---------------------------------------------------
  const invoices = await Promise.all([
    prisma.invoice.upsert({
      where: {
        organizationId_invoiceNo: {
          organizationId: org.id,
          invoiceNo: "INV-2024-001",
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        franchiseeId: franchisee.id,
        agreementId: agreement.id,
        invoiceNo: "INV-2024-001",
        status: "ISSUED",
        issueDate: new Date("2024-02-01"),
        dueDate: new Date("2024-02-15"),
        subtotal: 3000,
        tax: 300,
        total: 3300,
        amountPaid: 3300,
        notes: "February 2024 royalty + marketing fee",
      },
    }),
    prisma.invoice.upsert({
      where: {
        organizationId_invoiceNo: {
          organizationId: org.id,
          invoiceNo: "INV-2024-002",
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        franchiseeId: franchisee.id,
        agreementId: agreement.id,
        invoiceNo: "INV-2024-002",
        status: "PARTIALLY_PAID",
        issueDate: new Date("2024-03-01"),
        dueDate: new Date("2024-03-15"),
        subtotal: 3000,
        tax: 300,
        total: 3300,
        amountPaid: 1500,
        notes: "March 2024 royalty + marketing fee",
      },
    }),
    prisma.invoice.upsert({
      where: {
        organizationId_invoiceNo: {
          organizationId: org.id,
          invoiceNo: "INV-2024-003",
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        franchiseeId: franchisee.id,
        agreementId: agreement.id,
        invoiceNo: "INV-2024-003",
        status: "OVERDUE",
        issueDate: new Date("2024-04-01"),
        dueDate: new Date("2024-04-15"),
        subtotal: 3000,
        tax: 300,
        total: 3300,
        amountPaid: 0,
        notes: "April 2024 royalty + marketing fee",
      },
    }),
  ])
  console.log(`Invoices: ${invoices.length} created`)

  // -- 13. Invoice Lines ----------------------------------------------
  for (const inv of invoices) {
    await prisma.invoiceLine.create({
      data: {
        invoiceId: inv.id,
        description: "Monthly royalty fee (6%)",
        quantity: 1,
        unitPrice: inv.subtotal,
        amount: inv.subtotal,
      },
    })
    await prisma.invoiceLine.create({
      data: {
        invoiceId: inv.id,
        description: "Marketing fee (2%)",
        quantity: 1,
        unitPrice: inv.tax,
        amount: inv.tax,
      },
    })
  }
  // ── 14. Payments ───────────────────────────────────────────────────
  const payments = await Promise.all([
    prisma.payment.upsert({
      where: {
        organizationId_provider_providerRef: {
          organizationId: org.id,
          provider: "stripe",
          providerRef: "ch_20240201_001",
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        invoiceId: invoices[0].id,
        reference: "INV-2024-001",
        amount: 3300,
        method: "CARD",
        status: "SUCCEEDED",
        paidAt: new Date("2024-02-05"),
        provider: "stripe",
        providerRef: "ch_20240201_001",
        notes: "Royalty payment for February",
      },
    }),
    prisma.payment.upsert({
      where: {
        organizationId_provider_providerRef: {
          organizationId: org.id,
          provider: "stripe",
          providerRef: "ch_20240305_001",
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        invoiceId: invoices[1].id,
        reference: "INV-2024-002",
        amount: 1500,
        method: "BANK_TRANSFER",
        status: "SUCCEEDED",
        paidAt: new Date("2024-03-05"),
        provider: "stripe",
        providerRef: "ch_20240305_001",
        notes: "Partial payment for March",
      },
    }),
  ])
  console.log(`Payments: ${payments.length} created`)

  // ── 15. Customers ──────────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: {
        organizationId_customerNo: {
          organizationId: org.id,
          customerNo: "CUST-001",
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        customerNo: "CUST-001",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1-555-1001",
        taxId: null,
        address: {
          street: "789 Oak Ave",
          city: "Austin",
          state: "TX",
          zip: "78702",
        },
        active: true,
      },
    }),
    prisma.customer.upsert({
      where: {
        organizationId_customerNo: {
          organizationId: org.id,
          customerNo: "CUST-002",
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        customerNo: "CUST-002",
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "+1-555-1002",
        taxId: null,
        address: {
          street: "321 Pine Rd",
          city: "Austin",
          state: "TX",
          zip: "78703",
        },
        active: true,
      },
    }),
  ])
  console.log(`Customers: ${customers.length} created`)

  // ── 16. Products ───────────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.upsert({
      where: {
        organizationId_sku: { organizationId: org.id, sku: "QB-BGR-001" },
      },
      update: {},
      create: {
        organizationId: org.id,
        sku: "QB-BGR-001",
        name: "Classic Burger",
        description: "Beef patty, lettuce, tomato, special sauce",
        unitPrice: 12.99,
        costPrice: 4.5,
        taxRate: 8.25,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: {
        organizationId_sku: { organizationId: org.id, sku: "QB-FRY-002" },
      },
      update: {},
      create: {
        organizationId: org.id,
        sku: "QB-FRY-002",
        name: "French Fries",
        description: "Crispy golden fries",
        unitPrice: 4.99,
        costPrice: 1.2,
        taxRate: 8.25,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: {
        organizationId_sku: { organizationId: org.id, sku: "QB-SOD-003" },
      },
      update: {},
      create: {
        organizationId: org.id,
        sku: "QB-SOD-003",
        name: "Soft Drink",
        description: "16 oz fountain drink",
        unitPrice: 2.99,
        costPrice: 0.6,
        taxRate: 8.25,
        active: true,
      },
    }),
  ])
  console.log(`Products: ${products.length} created`)

  // ── 17. POS Terminal ───────────────────────────────────────────────
  const terminal = await prisma.posTerminal.upsert({
    where: {
      organizationId_code: { organizationId: org.id, code: "POS-MS-01" },
    },
    update: {},
    create: {
      organizationId: org.id,
      locationId: locations[0].id,
      code: "POS-MS-01",
      name: "Main Register",
      active: true,
    },
  })
  console.log(`POS Terminal: ${terminal.name} (${terminal.id})`)

  // ── 18. Cashier Shift ──────────────────────────────────────────────
  const shift = await prisma.cashierShift.upsert({
    where: { id: "shift-seed-001" },
    update: {},
    create: {
      id: "shift-seed-001",
      organizationId: org.id,
      terminalId: terminal.id,
      cashierId: users[3].id,
      status: "CLOSED",
      openedAt: new Date("2024-01-15T08:00:00"),
      closedAt: new Date("2024-01-15T20:00:00"),
      openingFloat: 200.0,
      expectedCash: 1250.0,
      countedCash: 1245.5,
      variance: -4.5,
    },
  })
  console.log(`Cashier shift: ${shift.id} (${shift.status})`)

  // ── 19. Sales ────────────────────────────────────────────────────
  const sales = await Promise.all([
    prisma.sale.upsert({
      where: {
        organizationId_receiptNo: {
          organizationId: org.id,
          receiptNo: "RCP-20240115-001",
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        customerId: customers[0].id,
        terminalId: terminal.id,
        shiftId: shift.id,
        receiptNo: "RCP-20240115-001",
        idempotencyKey: "idem-sale-001",
        status: "COMPLETED",
        soldAt: new Date("2024-01-15T12:30:00"),
        subtotal: 20.97,
        discount: 0,
        tax: 1.73,
        total: 22.7,
      },
    }),
    prisma.sale.upsert({
      where: {
        organizationId_receiptNo: {
          organizationId: org.id,
          receiptNo: "RCP-20240115-002",
        },
      },
      update: {},
      create: {
        organizationId: org.id,
        customerId: customers[1].id,
        terminalId: terminal.id,
        shiftId: shift.id,
        receiptNo: "RCP-20240115-002",
        idempotencyKey: "idem-sale-002",
        status: "COMPLETED",
        soldAt: new Date("2024-01-15T13:15:00"),
        subtotal: 17.98,
        discount: 2.0,
        tax: 1.32,
        total: 17.3,
      },
    }),
  ])
  console.log(`Sales: ${sales.length} created`)

  // ── 20. Sale Lines ───────────────────────────────────────────────
  await prisma.saleLine.createMany({
    data: [
      {
        saleId: sales[0].id,
        productId: products[0].id,
        description: "Classic Burger",
        quantity: 1,
        unitPrice: 12.99,
        discount: 0,
        tax: 1.07,
        total: 14.06,
      },
      {
        saleId: sales[0].id,
        productId: products[2].id,
        description: "Soft Drink",
        quantity: 1,
        unitPrice: 2.99,
        discount: 0,
        tax: 0.25,
        total: 3.24,
      },
      {
        saleId: sales[1].id,
        productId: products[1].id,
        description: "French Fries",
        quantity: 1,
        unitPrice: 4.99,
        discount: 0,
        tax: 0.41,
        total: 5.4,
      },
      {
        saleId: sales[1].id,
        productId: products[2].id,
        description: "Soft Drink",
        quantity: 1,
        unitPrice: 2.99,
        discount: 2.0,
        tax: 0.08,
        total: 1.07,
      },
    ],
  })
  // ── 21. Sale Payments ────────────────────────────────────────────
  await prisma.salePayment.createMany({
    data: [
      {
        saleId: sales[0].id,
        method: "CARD",
        amount: 22.7,
        reference: "card-001",
        status: "SUCCEEDED",
        paidAt: new Date("2024-01-15T12:30:00"),
      },
      {
        saleId: sales[1].id,
        method: "CASH",
        amount: 17.3,
        reference: "cash-001",
        status: "SUCCEEDED",
        paidAt: new Date("2024-01-15T13:15:00"),
      },
    ],
  })
  console.log("Sale payments: 2 created")

  // ── 22. Cash Movements ───────────────────────────────────────────
  await prisma.cashMovement.createMany({
    data: [
      {
        shiftId: shift.id,
        type: "FLOAT",
        amount: 200.0,
        reference: "opening-float",
      },
      {
        shiftId: shift.id,
        type: "CASH_IN",
        amount: 17.3,
        reference: "sale-cash-001",
      },
      {
        shiftId: shift.id,
        type: "CASH_DROP",
        amount: 100.0,
        reference: "mid-day-drop",
      },
    ],
  })
  console.log("Cash movements: 3 created")

  // ── 23. Documents ────────────────────────────────────────────────
  await prisma.document.createMany({
    data: [
      {
        organizationId: org.id,
        franchiseeId: franchisee.id,
        type: "AGREEMENT",
        name: "Franchise Agreement - Main Street",
        storageKey: "docs/franchise-agreement-main-street.pdf",
        contentType: "application/pdf",
        sizeBytes: 245760,
        checksum: "sha256:abc123def456",
        uploadedById: users[0].id,
      },
      {
        organizationId: org.id,
        locationId: locations[0].id,
        type: "LICENSE",
        name: "Health Department License",
        storageKey: "docs/health-license-qb-ms-001.pdf",
        contentType: "application/pdf",
        sizeBytes: 128000,
        checksum: "sha256:def789ghi012",
        uploadedById: users[1].id,
      },
    ],
  })
  console.log("Documents: 2 created")

  // ── 24. Support Tickets ──────────────────────────────────────────
  await prisma.supportTicket.createMany({
    data: [
      {
        organizationId: org.id,
        franchiseeId: franchisee.id,
        locationId: locations[0].id,
        createdById: users[3].id,
        assignedToId: users[2].id,
        subject: "POS terminal receipt printer jam",
        description:
          "Receipt printer on POS-MS-01 is jamming every 3-4 transactions.",
        status: "IN_PROGRESS",
        priority: "HIGH",
      },
      {
        organizationId: org.id,
        franchiseeId: franchisee.id,
        createdById: users[3].id,
        subject: "Inventory count discrepancy",
        description:
          "Weekly inventory count shows 15 units of beef patties missing.",
        status: "OPEN",
        priority: "NORMAL",
      },
    ],
  })
  console.log("Support tickets: 2 created")

  // ── 25. Audit Logs ───────────────────────────────────────────────
  await prisma.auditLog.createMany({
    data: [
      {
        organizationId: org.id,
        actorId: users[0].id,
        action: "CREATE",
        entity: "Organization",
        entityId: org.id,
        changes: { name: "Franchise Demo Organization" },
        ipAddress: "192.168.1.100",
        userAgent: "seed-script/1.0",
      },
      {
        organizationId: org.id,
        actorId: users[1].id,
        action: "UPDATE",
        entity: "FranchiseAgreement",
        entityId: agreement.id,
        changes: { status: "ACTIVE" },
        ipAddress: "192.168.1.101",
        userAgent: "seed-script/1.0",
      },
    ],
  })
  console.log("Audit logs: 2 created")

  console.log(`Invoice lines: ${invoices.length * 2} created`)
  console.log("")
  console.log("Seed complete! Summary:")
  console.log(`  Organization:   1`)
  console.log(`  Users:          ${users.length}`)
  console.log(`  Memberships:    ${memberships.length}`)
  console.log(`  Brands:         1`)
  console.log(`  Franchisees:    1`)
  console.log(`  Locations:      ${locations.length}`)
  console.log(`  Applications:   1`)
  console.log(`  Agreements:     1`)
  console.log(`  Invoices:       ${invoices.length}`)
  console.log(`  Payments:       ${payments.length}`)
  console.log(`  Customers:      ${customers.length}`)
  console.log(`  Products:       ${products.length}`)
  console.log(`  Sales:          ${sales.length}`)
  console.log(`  Documents:      2`)
  console.log(`  Support tickets: 2`)
  console.log(`  Audit logs:     2`)
  console.log("")
  console.log("Test credentials:")
  users.forEach((u) => console.log(`  ${u.email} / <seed-password>`))
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
