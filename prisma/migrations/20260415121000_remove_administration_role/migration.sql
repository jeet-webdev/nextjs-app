UPDATE "User"
SET "userType" = 'ADMIN'
WHERE "userType" = 'ADMINISTRATION';

ALTER TYPE "UserType" RENAME TO "UserType_old";

CREATE TYPE "UserType" AS ENUM ('OWNER', 'CUSTOMER', 'ADMIN');

ALTER TABLE "User"
ALTER COLUMN "userType" DROP DEFAULT,
ALTER COLUMN "userType" TYPE "UserType"
USING ("userType"::text::"UserType"),
ALTER COLUMN "userType" SET DEFAULT 'CUSTOMER';

DROP TYPE "UserType_old";
