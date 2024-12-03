CREATE TYPE public."NotificationMessageType" AS ENUM ('GENERIC', 'PASSWORD_EXPIRATION', 'USER_MAINTENANCE');

ALTER TABLE public."NotificationMessage" 
ADD COLUMN "type" public."NotificationMessageType" 
;

UPDATE public."NotificationMessage" set "type" = 'GENERIC';

ALTER TABLE public."NotificationMessage"
ALTER COLUMN "type" SET NOT NULL;