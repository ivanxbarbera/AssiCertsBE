CREATE TABLE public.user (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL
);