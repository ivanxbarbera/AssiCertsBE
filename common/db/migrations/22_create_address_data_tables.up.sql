CREATE TABLE "Nation" (
 "id" BIGSERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "code" TEXT,
  "deprecated" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "Region" (
 "id" BIGSERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "deprecated" BOOLEAN NOT NULL DEFAULT FALSE,
  "nationId" BIGSERIAL NOT NULL REFERENCES "Nation"("id")
);

CREATE TABLE "Province" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "code" TEXT,
  "deprecated" BOOLEAN NOT NULL DEFAULT FALSE,
  "regionId" BIGSERIAL NOT NULL REFERENCES "Region"("id")
);

CREATE TABLE "Municipality" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "code" TEXT,
  "deprecated" BOOLEAN NOT NULL DEFAULT FALSE,
  "provinceId" BIGSERIAL NOT NULL REFERENCES "Province"("id")
);
