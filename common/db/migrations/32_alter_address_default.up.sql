
ALTER TABLE public."CustomerAddress" 
ADD COLUMN "default" BOOLEAN 
;

UPDATE public."CustomerAddress" set "default" = false;

ALTER TABLE "CustomerAddress"
	ALTER COLUMN "default" TYPE BOOLEAN,
	ALTER COLUMN "default" SET NOT NULL,
	ALTER COLUMN "default" DROP DEFAULT;






