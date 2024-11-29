CREATE TABLE public."UserPasswordHistory" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL NOT NULL,
    "date" DATE NOT NULL,
    "passwordHash" TEXT NOT NULL
);

ALTER TABLE public."UserPasswordHistory"
ADD CONSTRAINT "FkUphUserId"
FOREIGN KEY ("userId") REFERENCES public."User"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

INSERT INTO PUBLIC."UserPasswordHistory" ("userId", "date", "passwordHash") SELECT "id", NOW(), "passwordHash" FROM PUBLIC."User";