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
  "deleted_at" timestamp without time zone,
  "user_id" int NOT NULL,
  "name" varchar(128) NOT NULL
);

CREATE TABLE "category" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp without time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  "deleted_at" timestamp without time zone,
  "name" varchar(128) NOT NULL,
  "parent_category_id" int,
  "is_global" boolean NOT NULL,
  "user_id" int
);

CREATE TABLE "transaction" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp without time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  "deleted_at" timestamp without time zone,
  "src_wallet_id" int,
  "dst_wallet_id" int,
  "amount" int NOT NULL,
  "description" varchar(256),
  "category_id" int NOT NULL
);

ALTER TABLE "wallet" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "category" ADD FOREIGN KEY ("parent_category_id") REFERENCES "category" ("id");
ALTER TABLE "category" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "category" ADD CONSTRAINT "chk_user_set_for_private_categories" CHECK ("is_global" OR "user_id" IS NOT NULL);

ALTER TABLE "transaction" ADD FOREIGN KEY ("src_wallet_id") REFERENCES "wallet" ("id");
ALTER TABLE "transaction" ADD FOREIGN KEY ("dst_wallet_id") REFERENCES "wallet" ("id");
ALTER TABLE "transaction" ADD FOREIGN KEY ("category_id") REFERENCES "category" ("id");
ALTER TABLE "transaction" ADD CONSTRAINT "chk_min_one_wallets" CHECK ("src_wallet_id" IS NOT NULL OR "dst_wallet_id" IS NOT NULL);