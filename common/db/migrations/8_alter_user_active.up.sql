ALTER TABLE public."User" 
ADD COLUMN
    "disabled" BOOLEAN
;

UPDATE public."User" set "disabled" = false;