CREATE TABLE public."UserPasswordReset" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "used" BOOLEAN NOT NULL
);

ALTER TABLE public."UserPasswordReset"
ADD CONSTRAINT "FkUprUserId"
FOREIGN KEY ("userId") REFERENCES public."User"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;
