-- 1) profiles: prevent role self-escalation
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'role cannot be changed by user' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_role_change ON public.profiles;
CREATE TRIGGER profiles_prevent_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (current_setting('role', true) <> 'service_role')
  EXECUTE FUNCTION public.prevent_profile_role_change();

-- 2) providers: lock platform-controlled fields
CREATE OR REPLACE FUNCTION public.prevent_provider_protected_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.verified   IS DISTINCT FROM OLD.verified
  OR NEW.top_rated  IS DISTINCT FROM OLD.top_rated
  OR NEW.rating     IS DISTINCT FROM OLD.rating
  OR NEW.jobs_done  IS DISTINCT FROM OLD.jobs_done THEN
    RAISE EXCEPTION 'verified, top_rated, rating and jobs_done are managed by the platform' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS providers_prevent_protected_change ON public.providers;
CREATE TRIGGER providers_prevent_protected_change
  BEFORE UPDATE ON public.providers
  FOR EACH ROW
  WHEN (current_setting('role', true) <> 'service_role')
  EXECUTE FUNCTION public.prevent_provider_protected_change();

-- 3) bookings: homeowners may only change scheduling/address/notes fields
CREATE OR REPLACE FUNCTION public.restrict_booking_homeowner_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only enforce when the row owner (homeowner) is the one updating.
  IF auth.uid() IS NULL OR auth.uid() <> OLD.homeowner_id THEN
    RETURN NEW;
  END IF;

  IF NEW.homeowner_id   IS DISTINCT FROM OLD.homeowner_id
  OR NEW.provider_id    IS DISTINCT FROM OLD.provider_id
  OR NEW.sub_service_id IS DISTINCT FROM OLD.sub_service_id
  OR NEW.service_name   IS DISTINCT FROM OLD.service_name
  OR NEW.status         IS DISTINCT FROM OLD.status
  OR NEW.total_amount   IS DISTINCT FROM OLD.total_amount
  OR NEW.platform_fee   IS DISTINCT FROM OLD.platform_fee
  OR NEW.hourly_rate    IS DISTINCT FROM OLD.hourly_rate
  OR NEW.est_hours      IS DISTINCT FROM OLD.est_hours
  OR NEW.ref_code       IS DISTINCT FROM OLD.ref_code
  OR NEW.payment_method IS DISTINCT FROM OLD.payment_method
  OR NEW.job_type       IS DISTINCT FROM OLD.job_type THEN
    RAISE EXCEPTION 'homeowners can only edit scheduling, address and notes on a booking' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_restrict_homeowner_update ON public.bookings;
CREATE TRIGGER bookings_restrict_homeowner_update
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  WHEN (current_setting('role', true) <> 'service_role')
  EXECUTE FUNCTION public.restrict_booking_homeowner_update();