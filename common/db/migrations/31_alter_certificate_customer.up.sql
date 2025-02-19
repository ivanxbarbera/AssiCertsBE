ALTER TABLE public."Certificate" DROP COLUMN "customerFirstName";
ALTER TABLE public."Certificate" DROP COLUMN "customerMiddleName";
ALTER TABLE public."Certificate" DROP COLUMN "customerLastName";
ALTER TABLE public."Certificate" DROP COLUMN "customerMobileTelephone";
ALTER TABLE public."Certificate" DROP COLUMN "customerEmailAddress";
ALTER TABLE public."Certificate" DROP COLUMN "customerFiscalCode";
ALTER TABLE public."Certificate" DROP COLUMN "customerDateOfBirth";

DROP TABLE public."CertificateAddress";

CREATE TABLE public."CertificateCustomer" (
    "id" BIGSERIAL PRIMARY KEY,
    "certificateId" BIGSERIAL NOT NULL,
    "customerId" BIGSERIAL NOT NULL
);

ALTER TABLE public."CertificateCustomer"
ADD CONSTRAINT "FkCcCertificateId"
FOREIGN KEY ("certificateId") REFERENCES public."Certificate"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."CertificateCustomer"
ADD CONSTRAINT "FkCcCustomerId"
FOREIGN KEY ("customerId") REFERENCES public."Customer"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

