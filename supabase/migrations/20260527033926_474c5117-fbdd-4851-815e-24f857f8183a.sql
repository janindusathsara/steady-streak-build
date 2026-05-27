
-- 1. Add columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'homeowner';

-- Backfill any existing rows with a username based on display_name or id
UPDATE public.profiles
SET username = COALESCE(NULLIF(regexp_replace(lower(display_name), '[^a-z0-9]+', '', 'g'), ''), 'user_' || substr(id::text, 1, 8))
WHERE username IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN username SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique ON public.profiles (lower(username));

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('homeowner','provider','admin'));

-- 2. Replace handle_new_user to capture username + role from signup metadata,
--    with a safe fallback if username is missing or taken.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_username text;
  v_base text;
  v_role text;
  v_attempt int := 0;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'homeowner');
  IF v_role NOT IN ('homeowner','provider','admin') THEN
    v_role := 'homeowner';
  END IF;

  v_base := lower(regexp_replace(
    COALESCE(
      NEW.raw_user_meta_data ->> 'username',
      NEW.raw_user_meta_data ->> 'full_name',
      split_part(NEW.email, '@', 1)
    ),
    '[^a-z0-9]+', '', 'g'
  ));
  IF v_base = '' OR v_base IS NULL THEN
    v_base := 'user';
  END IF;

  v_username := v_base;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = v_username) LOOP
    v_attempt := v_attempt + 1;
    v_username := v_base || v_attempt::text;
  END LOOP;

  INSERT INTO public.profiles (id, display_name, avatar_url, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture'),
    v_username,
    v_role
  );
  RETURN NEW;
END;
$function$;

-- 3. Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Allow authenticated users to view any profile (needed for username -> route lookup)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);
