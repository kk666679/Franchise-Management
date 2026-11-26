-- prisma/commerce/rls/policies.sql
-- Row-level security backstop for the commerce schema.
-- Set per request via lib/server/commerce/tenant/context.ts:
--   SELECT set_config('app.tenant_id', $1, true)
--   SELECT set_config('app.territory_id', $2, true)

ALTER TABLE "CommerceTenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Territory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Variant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FranchiseePrice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CartLine" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderLine" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Fulfillment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Return" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OutboxEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IdempotencyKey" ENABLE ROW LEVEL SECURITY;

-- Orders are visible only within the request's tenant AND territory.
CREATE POLICY order_tenant_isolation ON "Order"
  USING (tenantId = current_setting('app.tenant_id')::text);
CREATE POLICY order_territory_isolation ON "Order"
  USING (territoryId = current_setting('app.territory_id')::text);

-- Cart lines inherit cart isolation.
CREATE POLICY cart_tenant_isolation ON "Cart"
  USING (tenantId = current_setting('app.tenant_id')::text);
CREATE POLICY cartline_tenant_isolation ON "CartLine"
  USING (
    EXISTS (
      SELECT 1 FROM "Cart" c
      WHERE c.id = "CartLine"."cartId"
        AND c.tenantId = current_setting('app.tenant_id')::text
    )
  );

-- Products are scoped to tenant.
CREATE POLICY product_tenant_isolation ON "Product"
  USING (tenantId = current_setting('app.tenant_id')::text);
