CREATE TYPE public."UserRole" AS ENUM ('MEMBER', 'ADMIN', 'SUPERADMIN');

ALTER TABLE public."User" 
ADD COLUMN "role" public."UserRole" 
;

UPDATE public."User" set "role" = 'MEMBER';

ALTER TABLE public."User"
ALTER COLUMN "role" SET NOT NULL;