CREATE TABLE public."Certificate" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGSERIAL NOT NULL,
    "transactionType" TEXT NOT NULL,
    "cancellationType" TEXT ,
    "clientNumber" TEXT UNIQUE NOT NULL,
    "callerCode" TEXT NOT NULL,
    "dateOfCall" DATE NOT NULL,
    "effectiveDate" DATE NOT NULL,
    "policyNumber" TEXT UNIQUE NOT NULL,
    "customerFirstName" TEXT NOT NULL,
    "customerMiddleName" TEXT ,
    "customerLastName" TEXT NOT NULL,
    "customerMobileTelephone" TEXT NOT NULL,
    "customerEmailAddress" TEXT NOT NULL,
    "customerFiscalCode" TEXT NOT NULL,
    "customerDateOfBirth" DATE NOT NULL,
    "fulfillmentType" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "paymentFrequency" TEXT NOT NULL,
    "mainInsuredProductCodeA" TEXT NOT NULL,
    "mainInsuredProductOptionA" TEXT NOT NULL
);

ALTER TABLE public."Certificate"
ADD CONSTRAINT "FkCUserId"
FOREIGN KEY ("userId") REFERENCES public."User"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

CREATE TABLE public."CertificateAddress" (
    "id" BIGSERIAL PRIMARY KEY,
    "certificateId" BIGSERIAL NOT NULL,
    "addressId" BIGSERIAL NOT NULL
);

ALTER TABLE public."CertificateAddress"
ADD CONSTRAINT "FkCaCertificateId"
FOREIGN KEY ("certificateId") REFERENCES public."Certificate"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."CertificateAddress"
ADD CONSTRAINT "FkCaAddressId"
FOREIGN KEY ("addressId") REFERENCES public."Address"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;
