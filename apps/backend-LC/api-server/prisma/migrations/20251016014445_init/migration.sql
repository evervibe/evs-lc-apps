-- CreateTable
CREATE TABLE "portal_users" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMPTZ,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "portal_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_user_security" (
    "user_id" BIGINT NOT NULL,
    "totp_secret" TEXT,
    "totp_enabled" BOOLEAN NOT NULL DEFAULT false,
    "backup_codes" TEXT,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMPTZ,
    "password_changed_at" TIMESTAMPTZ,

    CONSTRAINT "portal_user_security_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "portal_oauth_providers" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "provider_username" TEXT,
    "provider_email" TEXT,
    "provider_avatar" TEXT,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_oauth_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_game_accounts" (
    "id" BIGSERIAL NOT NULL,
    "portal_user_id" BIGINT NOT NULL,
    "game_user_code" BIGINT NOT NULL,
    "server_id" TEXT NOT NULL,
    "linked_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_sync_at" TIMESTAMPTZ,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "portal_game_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_sessions" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "payload" JSONB NOT NULL,
    "last_activity" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "portal_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_activity_log" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "action" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_roles" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "portal_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_permissions" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "portal_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_role_permissions" (
    "role_id" BIGINT NOT NULL,
    "permission_id" BIGINT NOT NULL,

    CONSTRAINT "portal_role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "portal_user_roles" (
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "portal_news" (
    "id" BIGSERIAL NOT NULL,
    "category" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published_at" TIMESTAMPTZ NOT NULL,
    "author" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_donations" (
    "id" BIGSERIAL NOT NULL,
    "account_id" BIGINT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_payments" (
    "id" BIGSERIAL NOT NULL,
    "item_name" TEXT,
    "item_number" TEXT,
    "payment_status" TEXT,
    "payment_amount" DECIMAL(12,2),
    "payment_currency" TEXT,
    "txn_id" TEXT,
    "receiver_email" TEXT,
    "payer_email" TEXT,
    "custom" TEXT,
    "createdtime" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_tickets" (
    "id" BIGSERIAL NOT NULL,
    "account" BIGINT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_votes" (
    "id" BIGSERIAL NOT NULL,
    "site" TEXT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "account_ip" TEXT NOT NULL,
    "voted_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "portal_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_redeem_codes" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "redeem_type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "used_by" BIGINT,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_redeem_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_market_listings" (
    "id" BIGSERIAL NOT NULL,
    "server_id" TEXT NOT NULL,
    "seller_char_index" BIGINT NOT NULL,
    "seller_char_name" TEXT NOT NULL,
    "item_id" BIGINT NOT NULL,
    "serial" TEXT,
    "plus" INTEGER NOT NULL DEFAULT 0,
    "flag" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price_gold" BIGINT NOT NULL,
    "item_options" JSONB,
    "now_dur" INTEGER,
    "max_dur" INTEGER,
    "listed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "portal_market_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portal_users_username_key" ON "portal_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "portal_users_email_key" ON "portal_users"("email");

-- CreateIndex
CREATE INDEX "portal_users_username_idx" ON "portal_users"("username");

-- CreateIndex
CREATE INDEX "portal_users_email_idx" ON "portal_users"("email");

-- CreateIndex
CREATE INDEX "portal_users_status_idx" ON "portal_users"("status");

-- CreateIndex
CREATE INDEX "portal_users_created_at_idx" ON "portal_users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "portal_oauth_providers_provider_provider_user_id_key" ON "portal_oauth_providers"("provider", "provider_user_id");

-- CreateIndex
CREATE INDEX "portal_game_accounts_portal_user_id_idx" ON "portal_game_accounts"("portal_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "portal_game_accounts_game_user_code_server_id_key" ON "portal_game_accounts"("game_user_code", "server_id");

-- CreateIndex
CREATE INDEX "portal_sessions_user_id_idx" ON "portal_sessions"("user_id");

-- CreateIndex
CREATE INDEX "portal_sessions_last_activity_idx" ON "portal_sessions"("last_activity");

-- CreateIndex
CREATE INDEX "portal_activity_log_user_id_idx" ON "portal_activity_log"("user_id");

-- CreateIndex
CREATE INDEX "portal_activity_log_action_idx" ON "portal_activity_log"("action");

-- CreateIndex
CREATE INDEX "portal_activity_log_created_at_idx" ON "portal_activity_log"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "portal_roles_name_key" ON "portal_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "portal_permissions_name_key" ON "portal_permissions"("name");

-- CreateIndex
CREATE INDEX "portal_news_category_idx" ON "portal_news"("category");

-- CreateIndex
CREATE INDEX "portal_news_published_at_idx" ON "portal_news"("published_at");

-- CreateIndex
CREATE INDEX "portal_donations_account_id_idx" ON "portal_donations"("account_id");

-- CreateIndex
CREATE INDEX "portal_donations_status_idx" ON "portal_donations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "portal_payments_txn_id_key" ON "portal_payments"("txn_id");

-- CreateIndex
CREATE INDEX "portal_payments_payment_status_idx" ON "portal_payments"("payment_status");

-- CreateIndex
CREATE INDEX "portal_payments_createdtime_idx" ON "portal_payments"("createdtime");

-- CreateIndex
CREATE INDEX "portal_tickets_account_idx" ON "portal_tickets"("account");

-- CreateIndex
CREATE INDEX "portal_tickets_status_idx" ON "portal_tickets"("status");

-- CreateIndex
CREATE INDEX "portal_tickets_created_at_idx" ON "portal_tickets"("created_at");

-- CreateIndex
CREATE INDEX "portal_votes_account_id_idx" ON "portal_votes"("account_id");

-- CreateIndex
CREATE INDEX "portal_votes_voted_at_idx" ON "portal_votes"("voted_at");

-- CreateIndex
CREATE UNIQUE INDEX "portal_votes_site_account_id_voted_at_key" ON "portal_votes"("site", "account_id", "voted_at");

-- CreateIndex
CREATE UNIQUE INDEX "portal_redeem_codes_code_key" ON "portal_redeem_codes"("code");

-- CreateIndex
CREATE INDEX "portal_redeem_codes_code_idx" ON "portal_redeem_codes"("code");

-- CreateIndex
CREATE INDEX "portal_redeem_codes_status_idx" ON "portal_redeem_codes"("status");

-- CreateIndex
CREATE INDEX "portal_market_listings_server_id_idx" ON "portal_market_listings"("server_id");

-- CreateIndex
CREATE INDEX "portal_market_listings_status_idx" ON "portal_market_listings"("status");

-- CreateIndex
CREATE INDEX "portal_market_listings_listed_at_idx" ON "portal_market_listings"("listed_at");

-- AddForeignKey
ALTER TABLE "portal_user_security" ADD CONSTRAINT "portal_user_security_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_oauth_providers" ADD CONSTRAINT "portal_oauth_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_game_accounts" ADD CONSTRAINT "portal_game_accounts_portal_user_id_fkey" FOREIGN KEY ("portal_user_id") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_sessions" ADD CONSTRAINT "portal_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_activity_log" ADD CONSTRAINT "portal_activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "portal_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_role_permissions" ADD CONSTRAINT "portal_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "portal_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_role_permissions" ADD CONSTRAINT "portal_role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "portal_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_user_roles" ADD CONSTRAINT "portal_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_user_roles" ADD CONSTRAINT "portal_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "portal_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_tickets" ADD CONSTRAINT "portal_tickets_account_fkey" FOREIGN KEY ("account") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_votes" ADD CONSTRAINT "portal_votes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "portal_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_redeem_codes" ADD CONSTRAINT "portal_redeem_codes_used_by_fkey" FOREIGN KEY ("used_by") REFERENCES "portal_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
