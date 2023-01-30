-- As part of adding Google Auth, password field is no longer required

ALTER TABLE "user" ALTER COLUMN "password_hash" DROP NOT NULL;