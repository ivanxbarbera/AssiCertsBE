CREATE TABLE public."user_password_reset" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "used" BOOLEAN NOT NULL
);

ALTER TABLE public.user_password_reset
ADD CONSTRAINT fk_upr_userId
FOREIGN KEY ("userId") REFERENCES public.user(id)
ON UPDATE CASCADE
ON DELETE RESTRICT
;
