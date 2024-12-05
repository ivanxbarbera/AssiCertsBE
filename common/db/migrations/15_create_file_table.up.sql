CREATE TYPE public."FileEntryType" AS ENUM ('GENERIC', 'PROFILE_IMAGE');

CREATE TABLE public."FileEntry" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL NOT NULL,
    "type" public."FileEntryType" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "data" BYTEA NOT NULL
);

ALTER TABLE public."FileEntry"
ADD CONSTRAINT "FkFeUserId"
FOREIGN KEY ("userId") REFERENCES public."User"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;