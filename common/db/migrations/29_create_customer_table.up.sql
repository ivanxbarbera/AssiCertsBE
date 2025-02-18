CREATE TABLE public."Customer" (
    "id" BIGSERIAL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "fiscalCode" TEXT NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "mobileTelephone" TEXT NOT NULL
);

CREATE TABLE public."CustomerAddress" (
    "id" BIGSERIAL PRIMARY KEY,
    "customerId" BIGSERIAL NOT NULL,
    "addressId" BIGSERIAL NOT NULL
);

ALTER TABLE public."CustomerAddress"
ADD CONSTRAINT "FkCaCustomerId"
FOREIGN KEY ("customerId") REFERENCES public."Customer"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."CustomerAddress"
ADD CONSTRAINT "FkCaAddressId"
FOREIGN KEY ("addressId") REFERENCES public."Address"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."CustomerEmail" (
    "id" BIGSERIAL PRIMARY KEY,
    "customerId" BIGSERIAL NOT NULL,
    "emailId" BIGSERIAL NOT NULL,
    "default" BOOLEAN NOT NULL
);

ALTER TABLE public."CustomerEmail"
ADD CONSTRAINT "FkCeCustomerId"
FOREIGN KEY ("customerId") REFERENCES public."Customer"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."CustomerEmail"
ADD CONSTRAINT "FkCeEmailId"
FOREIGN KEY ("emailId") REFERENCES public."Email"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."CustomerUser" (
    "id" BIGSERIAL PRIMARY KEY,
    "customerId" BIGSERIAL NOT NULL,
    "userId" BIGSERIAL NOT NULL
);

ALTER TABLE public."CustomerUser"
ADD CONSTRAINT "FkCuCustomerId"
FOREIGN KEY ("customerId") REFERENCES public."Customer"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."CustomerUser"
ADD CONSTRAINT "FkCuUserId"
FOREIGN KEY ("userId") REFERENCES public."User"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;