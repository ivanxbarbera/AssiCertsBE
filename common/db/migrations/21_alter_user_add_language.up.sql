ALTER TABLE public."User" 
ADD COLUMN "language" TEXT 
;

UPDATE public."User"
SET "language" = 'it';