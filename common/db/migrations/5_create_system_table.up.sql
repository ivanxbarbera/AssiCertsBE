CREATE TABLE public."System" (
    "id" BIGSERIAL PRIMARY KEY,
    "version" TEXT UNIQUE NOT NULL,
    "versionDate" DATE NOT NULL
);

