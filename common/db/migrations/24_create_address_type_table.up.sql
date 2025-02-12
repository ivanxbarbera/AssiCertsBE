CREATE TABLE public."AddressType" (
    "id" BIGSERIAL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

INSERT INTO public."AddressType" VALUES (1, 'MAI', 'Main');

ALTER TABLE public."Address" 
ADD COLUMN "typeId" BIGSERIAL NOT NULL
;

UPDATE public."Address"
SET "typeId" = 1;

ALTER TABLE public."Address"
ADD CONSTRAINT "FkATypeId"
FOREIGN KEY ("typeId") REFERENCES public."AddressType"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

