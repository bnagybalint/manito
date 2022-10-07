CREATE TABLE "user" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp without time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  "deleted_at" timestamp without time zone,
  "email" varchar(256) UNIQUE NOT NULL,
  "password_hash" varchar(512) NOT NULL,
  "name" varchar(128) NOT NULL
);

CREATE TABLE "wallet" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp without time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  "creator_id" bigint NOT NULL,
  "deleted_at" timestamp without time zone,
  "deleter_id" bigint,
  "owner_id" bigint NOT NULL,
  "name" varchar(128) NOT NULL
);

CREATE TABLE "category" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp without time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  "creator_id" bigint NOT NULL,
  "deleted_at" timestamp without time zone,
  "deleter_id" bigint,
  "name" varchar(128) NOT NULL,
  "parent_category_id" bigint,
  "owner_id" bigint
);

CREATE TABLE "transaction" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp without time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  -- FIXME notnull removed because API has no authorization yet, no way of knowing the creator user
  -- "creator_id" bigint NOT NULL,
  "creator_id" bigint,
  "deleted_at" timestamp without time zone,
  "deleter_id" bigint,
  "src_wallet_id" bigint,
  "dst_wallet_id" bigint,
  "time" timestamp without time zone NOT NULL,
  "amount" numeric(128,3) NOT NULL,
  "description" varchar(256),
  "category_id" bigint
);

ALTER TABLE "wallet" ADD FOREIGN KEY ("owner_id") REFERENCES "user" ("id");
ALTER TABLE "wallet" ADD FOREIGN KEY ("creator_id") REFERENCES "user" ("id");
ALTER TABLE "wallet" ADD FOREIGN KEY ("deleter_id") REFERENCES "user" ("id");
ALTER TABLE "wallet" ADD CONSTRAINT "chk_both_deleted_at_and_by" CHECK ("deleted_at" IS NULL OR "deleter_id" IS NOT NULL);

ALTER TABLE "category" ADD FOREIGN KEY ("parent_category_id") REFERENCES "category" ("id");
ALTER TABLE "category" ADD FOREIGN KEY ("owner_id") REFERENCES "user" ("id");
ALTER TABLE "category" ADD FOREIGN KEY ("creator_id") REFERENCES "user" ("id");
ALTER TABLE "category" ADD FOREIGN KEY ("deleter_id") REFERENCES "user" ("id");
ALTER TABLE "category" ADD CONSTRAINT "chk_both_deleted_at_and_by" CHECK ("deleted_at" IS NULL OR "deleter_id" IS NOT NULL);

ALTER TABLE "transaction" ADD FOREIGN KEY ("src_wallet_id") REFERENCES "wallet" ("id");
ALTER TABLE "transaction" ADD FOREIGN KEY ("dst_wallet_id") REFERENCES "wallet" ("id");
ALTER TABLE "transaction" ADD FOREIGN KEY ("category_id") REFERENCES "category" ("id");
ALTER TABLE "transaction" ADD FOREIGN KEY ("creator_id") REFERENCES "user" ("id");
ALTER TABLE "transaction" ADD FOREIGN KEY ("deleter_id") REFERENCES "user" ("id");
ALTER TABLE "transaction" ADD CONSTRAINT "chk_min_one_wallets" CHECK ("src_wallet_id" IS NOT NULL OR "dst_wallet_id" IS NOT NULL);
ALTER TABLE "transaction" ADD CONSTRAINT "chk_src_and_dst_wallets_different" CHECK ("src_wallet_id" != "dst_wallet_id");
ALTER TABLE "transaction" ADD CONSTRAINT "chk_both_deleted_at_and_by" CHECK ("deleted_at" IS NULL OR "deleter_id" IS NOT NULL);