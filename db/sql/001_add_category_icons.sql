CREATE TABLE "icon" (
  "id" BIGSERIAL PRIMARY KEY,
  "created_at" timestamp without time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  "deleted_at" timestamp without time zone,
  "name" varchar(128) NOT NULL,
  "image_url" varchar(512) NOT NULL
);

ALTER TABLE "category" ADD COLUMN "icon_id" bigint;
ALTER TABLE "category" ADD FOREIGN KEY ("icon_id") REFERENCES "icon" ("id");

ALTER TABLE "category" ADD COLUMN "icon_color" character(6);
ALTER TABLE "category" ADD CONSTRAINT "chk_rgb_values" CHECK ("icon_color" ~ '^[0-9a-f]{6}$');
COMMENT ON COLUMN "category"."icon_color" IS 'RGB color of the icon, described as string as HEX value of the format RRGGBB, without the prepending #.';

ALTER TABLE "category" ALTER COLUMN "icon_color" SET NOT NULL;
ALTER TABLE "category" ALTER COLUMN "icon_id" SET NOT NULL;
