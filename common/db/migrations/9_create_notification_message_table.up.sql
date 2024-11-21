CREATE TABLE public."NotificationMessage" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    "readed" BOOLEAN NOT NULL
);
