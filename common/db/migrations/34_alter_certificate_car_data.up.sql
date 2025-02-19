
ALTER TABLE public."Certificate" ADD COLUMN "carPlateNumber" TEXT;
ALTER TABLE public."Certificate" ADD COLUMN "carChassisNumber" TEXT;
ALTER TABLE public."Certificate" ADD COLUMN "carModel" TEXT;
ALTER TABLE public."Certificate" ADD COLUMN "policyDurationInMonth" INTEGER;

UPDATE public."Certificate" SET
  "carPlateNumber" = '',
  "carChassisNumber" = '',
  "carModel" = '',
  "policyDurationInMonth" = 0;

ALTER TABLE public."Certificate" ALTER COLUMN "carPlateNumber" SET NOT NULL, ALTER COLUMN "carPlateNumber" DROP DEFAULT;
ALTER TABLE public."Certificate" ALTER COLUMN "carChassisNumber" SET NOT NULL, ALTER COLUMN "carChassisNumber" DROP DEFAULT;
ALTER TABLE public."Certificate" ALTER COLUMN "carModel" SET NOT NULL, ALTER COLUMN "carModel" DROP DEFAULT;
ALTER TABLE public."Certificate" ALTER COLUMN "policyDurationInMonth" SET NOT NULL, ALTER COLUMN "policyDurationInMonth" DROP DEFAULT;




