
BEGIN;

-- ============================================================
-- 1. Helper function: verify the current user's role
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles AS p
        INNER JOIN public.roles AS r
            ON r.id = p.role_id
        WHERE p.id = (SELECT auth.uid())
          AND r.name = 'super_admin'
    );
$$;

-- Prevent public callers from executing the helper directly.
REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin()
    TO authenticated;


-- ============================================================
-- 2. Public read policies
-- ============================================================

CREATE POLICY "Public can read school info"
ON public.school_info
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can read staff"
ON public.staff
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can read student leadership"
ON public.student_table
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can read past leadership"
ON public.past_leadership
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can read notable people"
ON public.notable
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can read academic resources"
ON public.academic
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can read media"
ON public.media
FOR SELECT
TO anon, authenticated
USING (true);


-- ============================================================
-- 3. Super admin full CRUD policies
-- ============================================================

CREATE POLICY "Super admin manages school info"
ON public.school_info
FOR ALL
TO authenticated
USING ((SELECT public.is_super_admin()))
WITH CHECK ((SELECT public.is_super_admin()));

CREATE POLICY "Super admin manages staff"
ON public.staff
FOR ALL
TO authenticated
USING ((SELECT public.is_super_admin()))
WITH CHECK ((SELECT public.is_super_admin()));

CREATE POLICY "Super admin manages student leadership"
ON public.student_table
FOR ALL
TO authenticated
USING ((SELECT public.is_super_admin()))
WITH CHECK ((SELECT public.is_super_admin()));

CREATE POLICY "Super admin manages past leadership"
ON public.past_leadership
FOR ALL
TO authenticated
USING ((SELECT public.is_super_admin()))
WITH CHECK ((SELECT public.is_super_admin()));

CREATE POLICY "Super admin manages notable people"
ON public.notable
FOR ALL
TO authenticated
USING ((SELECT public.is_super_admin()))
WITH CHECK ((SELECT public.is_super_admin()));

CREATE POLICY "Super admin manages academic resources"
ON public.academic
FOR ALL
TO authenticated
USING ((SELECT public.is_super_admin()))
WITH CHECK ((SELECT public.is_super_admin()));

CREATE POLICY "Super admin manages media"
ON public.media
FOR ALL
TO authenticated
USING ((SELECT public.is_super_admin()))
WITH CHECK ((SELECT public.is_super_admin()));

COMMIT;
