CREATE TABLE public."SystemVersion" (
    "id" BIGSERIAL PRIMARY KEY,
    "version" TEXT UNIQUE NOT NULL,
    "versionDate" DATE NOT NULL
);

