-- Enable RLS on tables exposed through Supabase's public schema.
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ShortLink" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- This app accesses Postgres through server-side Prisma, not Supabase client roles.
REVOKE ALL ON TABLE public."User" FROM anon, authenticated;
REVOKE ALL ON TABLE public."ShortLink" FROM anon, authenticated;
REVOKE ALL ON TABLE public."Session" FROM anon, authenticated;
REVOKE ALL ON TABLE public."_prisma_migrations" FROM anon, authenticated;

-- Keep future Prisma tables private from Supabase API roles by default.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
