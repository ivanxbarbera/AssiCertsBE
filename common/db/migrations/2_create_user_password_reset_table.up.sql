CREATE TABLE public."user_password_reset" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "used" BOOLEAN NOT NULL
);