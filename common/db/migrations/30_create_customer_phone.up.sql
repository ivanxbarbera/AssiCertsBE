ALTER TABLE public."Customer" DROP COLUMN "mobileTelephone";

CREATE TABLE public."CustomerPhone" (
    "id" BIGSERIAL PRIMARY KEY,
    "customerId" BIGSERIAL NOT NULL,
    "phoneId" BIGSERIAL NOT NULL,
    "default" BOOLEAN NOT NULL
);

ALTER TABLE public."CustomerPhone"
ADD CONSTRAINT "FkCpCustomerId"
FOREIGN KEY ("customerId") REFERENCES public."Customer"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

ALTER TABLE public."CustomerPhone"
ADD CONSTRAINT "FkCpPhoneId"
FOREIGN KEY ("phoneId") REFERENCES public."Phone"("id")
ON UPDATE CASCADE
ON DELETE RESTRICT
;

