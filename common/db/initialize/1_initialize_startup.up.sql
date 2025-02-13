INSERT INTO public."EmailType" ("id", "code", "name") VALUES (1, 'PER', 'Personal');
INSERT INTO public."EmailType" ("id", "code", "name") VALUES (2, 'WOR', 'Work');
ALTER SEQUENCE public."EmailType_id_seq" RESTART WITH 3;

INSERT INTO public."User" ("id", "name", "surname", "siteLocked", "fiscalCode", "disabled", "role", "language") VALUES (1, 'AssiCerts', 'SuperAdmin', 'false', '', 'false', 'SUPERADMIN', '');
ALTER SEQUENCE public."User_id_seq" RESTART WITH 2;

INSERT INTO public."Email" ("id", "typeId", "email") VALUES (1, 1, 'sviluppo@ledinformatica.com');
ALTER SEQUENCE public."Email_id_seq" RESTART WITH 2;

INSERT INTO public."UserEmail" ("id", "userId", "emailId", "default", "authentication") VALUES (1, 1, 1, 'true', 'true');
ALTER SEQUENCE public."UserEmail_id_seq" RESTART WITH 2;

-- password: l3D&1nF0rMat!ca$
INSERT INTO public."UserPasswordHistory" ("id", "userId", "date", "passwordHash") VALUES (1, 1, '2025-02-01', '$2a$10$41ogwRNwE0ZFN6qkdUAyIOx/zTaF/VgbbyoiaeKLkyYZeOwt.CLTS');
ALTER SEQUENCE public."UserPasswordHistory_id_seq" RESTART WITH 2;
