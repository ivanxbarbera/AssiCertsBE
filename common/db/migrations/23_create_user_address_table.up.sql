CREATE TABLE public."AddressToponym" (
    "id" BIGSERIAL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

CREATE TABLE public."Address" (
    "id" BIGSERIAL PRIMARY KEY,
    "toponymId" BIGSERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "houseNumber" TEXT,
    "municipalityId" BIGSERIAL NOT NULL
);

ALTER TABLE public."Address"
ADD CONSTRAINT "FkAToponymId"
FOREIGN KEY ("toponymId") REFERENCES public."AddressToponym"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."Address"
ADD CONSTRAINT "FkAMunicipalityId"
FOREIGN KEY ("municipalityId") REFERENCES public."Municipality"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."UserAddress" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL NOT NULL,
    "addressId" BIGSERIAL NOT NULL
);

ALTER TABLE public."UserAddress"
ADD CONSTRAINT "FkUaUserId"
FOREIGN KEY ("userId") REFERENCES public."User"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."UserAddress"
ADD CONSTRAINT "FkUaAddressId"
FOREIGN KEY ("addressId") REFERENCES public."Address"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."PhoneType" (
    "id" BIGSERIAL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

CREATE TABLE public."Phone" (
    "id" BIGSERIAL PRIMARY KEY,
    "typeId" BIGSERIAL NOT NULL,
    "internationalPrefix" TEXT ,
    "prefix" TEXT ,
    "number" TEXT NOT NULL
);

ALTER TABLE public."Phone"
ADD CONSTRAINT "FkPTypeId"
FOREIGN KEY ("typeId") REFERENCES public."PhoneType"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."AddressPhone" (
    "id" BIGSERIAL PRIMARY KEY,
    "addressId" BIGSERIAL NOT NULL,
    "phoneId" BIGSERIAL NOT NULL,
    "default" BOOLEAN NOT NULL
);

ALTER TABLE public."AddressPhone"
ADD CONSTRAINT "FkApAddressId"
FOREIGN KEY ("addressId") REFERENCES public."Address"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."AddressPhone"
ADD CONSTRAINT "FkApPhoneId"
FOREIGN KEY ("phoneId") REFERENCES public."Phone"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."UserPhone" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL NOT NULL,
    "phoneId" BIGSERIAL NOT NULL,
    "default" BOOLEAN NOT NULL
);

ALTER TABLE public."UserPhone"
ADD CONSTRAINT "FkUpUserId"
FOREIGN KEY ("userId") REFERENCES public."User"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."UserPhone"
ADD CONSTRAINT "FkUpPhoneId"
FOREIGN KEY ("phoneId") REFERENCES public."Phone"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."EmailType" (
    "id" BIGSERIAL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

CREATE TABLE public."Email" (
    "id" BIGSERIAL PRIMARY KEY,
    "typeId" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL
);

ALTER TABLE public."Email"
ADD CONSTRAINT "FkETypeId"
FOREIGN KEY ("typeId") REFERENCES public."EmailType"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."AddressEmail" (
    "id" BIGSERIAL PRIMARY KEY,
    "addressId" BIGSERIAL NOT NULL,
    "emailId" BIGSERIAL NOT NULL,
    "default" BOOLEAN NOT NULL
);

ALTER TABLE public."AddressEmail"
ADD CONSTRAINT "FkAeAddressId"
FOREIGN KEY ("addressId") REFERENCES public."Address"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."AddressEmail"
ADD CONSTRAINT "FkAeEmailId"
FOREIGN KEY ("emailId") REFERENCES public."Email"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."UserEmail" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL NOT NULL,
    "emailId" BIGSERIAL NOT NULL,
    "default" BOOLEAN NOT NULL,
    "authentication" BOOLEAN NOT NULL
);

ALTER TABLE public."UserEmail"
ADD CONSTRAINT "FkUeUserId"
FOREIGN KEY ("userId") REFERENCES public."User"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."UserEmail"
ADD CONSTRAINT "FkUeEmailId"
FOREIGN KEY ("emailId") REFERENCES public."Email"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE "User"
	DROP COLUMN "email";