import dotenv from "dotenv"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

import { resolveDatabaseUrls } from "../lib/database-urls"

dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env" })

const { directUrl: databaseUrl } = resolveDatabaseUrls(process.env)

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be configured before Prisma can start")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
})

async function main() {
  const name = process.env.SEED_ORGANIZATION_NAME?.trim()
  const slug = process.env.SEED_ORGANIZATION_SLUG?.trim()

  if (!name && !slug) {
    console.log(
      "Seed skipped: no real organization details configured. No sample data was inserted."
    )
    return
  }

  if (!name || !slug) {
    throw new Error(
      "Set both SEED_ORGANIZATION_NAME and SEED_ORGANIZATION_SLUG to seed an organization."
    )
  }

  await prisma.organization.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  })

  console.log("Seeded the configured organization.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
