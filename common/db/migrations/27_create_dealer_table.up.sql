CREATE TABLE public."Dealer" (
    "id" BIGSERIAL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "vatNumber" TEXT UNIQUE NOT NULL,
    "fiscalCode" TEXT
);

CREATE TABLE public."DealerAddress" (
    "id" BIGSERIAL PRIMARY KEY,
    "dealerId" BIGSERIAL NOT NULL,
    "addressId" BIGSERIAL NOT NULL
);

ALTER TABLE public."DealerAddress"
ADD CONSTRAINT "FkDaDealerId"
FOREIGN KEY ("dealerId") REFERENCES public."Dealer"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."DealerAddress"
ADD CONSTRAINT "FkDaAddressId"
FOREIGN KEY ("addressId") REFERENCES public."Address"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."DealerEmail" (
    "id" BIGSERIAL PRIMARY KEY,
    "dealerId" BIGSERIAL NOT NULL,
    "emailId" BIGSERIAL NOT NULL,
    "default" BOOLEAN NOT NULL
);

ALTER TABLE public."DealerEmail"
ADD CONSTRAINT "FkUeDealerId"
FOREIGN KEY ("dealerId") REFERENCES public."Dealer"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."DealerEmail"
ADD CONSTRAINT "FkUeEmailId"
FOREIGN KEY ("emailId") REFERENCES public."Email"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;