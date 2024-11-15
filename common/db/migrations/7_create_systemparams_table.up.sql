CREATE TYPE public."SystemParameterType" AS ENUM ('TEXT', 'NUMBER', 'DECIMAL', 'BOOLEAN', 'DATE');

CREATE TABLE public."SystemParameter" (
    "id" BIGSERIAL PRIMARY KEY,
    "group" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" public."SystemParameterType" NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT 
);

ALTER TABLE public."SystemParameter" 
ADD CONSTRAINT "UqGroupCode" UNIQUE ("group", "code");