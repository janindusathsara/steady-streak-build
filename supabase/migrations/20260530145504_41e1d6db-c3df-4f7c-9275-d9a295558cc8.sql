
-- 1. Restrict provider updates on bookings to non-financial fields
CREATE OR REPLACE FUNCTION public.restrict_booking_provider_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> OLD.provider_id THEN
    RETURN NEW;
  END IF;

  IF NEW.homeowner_id   IS DISTINCT FROM OLD.homeowner_id
  OR NEW.provider_id    IS DISTINCT FROM OLD.provider_id
  OR NEW.sub_service_id IS DISTINCT FROM OLD.sub_service_id
  OR NEW.service_name   IS DISTINCT FROM OLD.service_name
  OR NEW.total_amount   IS DISTINCT FROM OLD.total_amount
  OR NEW.platform_fee   IS DISTINCT FROM OLD.platform_fee
  OR NEW.hourly_rate    IS DISTINCT FROM OLD.hourly_rate
  OR NEW.est_hours      IS DISTINCT FROM OLD.est_hours
  OR NEW.ref_code       IS DISTINCT FROM OLD.ref_code
  OR NEW.payment_method IS DISTINCT FROM OLD.payment_method
  OR NEW.job_type       IS DISTINCT FROM OLD.job_type
  OR NEW.address_line   IS DISTINCT FROM OLD.address_line
  OR NEW.postal_code    IS DISTINCT FROM OLD.postal_code
  OR NEW.district       IS DISTINCT FROM OLD.district
  OR NEW.landmarks      IS DISTINCT FROM OLD.landmarks
  OR NEW.problem_desc   IS DISTINCT FROM OLD.problem_desc
  OR NEW.scheduled_date IS DISTINCT FROM OLD.scheduled_date
  OR NEW.scheduled_time IS DISTINCT FROM OLD.scheduled_time THEN
    RAISE EXCEPTION 'providers can only update booking status' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.restrict_booking_provider_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_restrict_booking_provider_update ON public.bookings;
CREATE TRIGGER trg_restrict_booking_provider_update
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.restrict_booking_provider_update();

-- 2. Scope habit/habit_log mutation policies to authenticated role
DROP POLICY IF EXISTS "Users can create their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;

CREATE POLICY "Users can view their own habits" ON public.habits
FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habits" ON public.habits
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON public.habits
FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON public.habits
FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own logs" ON public.habit_logs;
DROP POLICY IF EXISTS "Users can delete their own logs" ON public.habit_logs;
DROP POLICY IF EXISTS "Users can view their own logs" ON public.habit_logs;

CREATE POLICY "Users can view their own logs" ON public.habit_logs
FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own logs" ON public.habit_logs
FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (SELECT 1 FROM public.habits WHERE habits.id = habit_logs.habit_id AND habits.user_id = auth.uid())
);
CREATE POLICY "Users can delete their own logs" ON public.habit_logs
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Explicitly deny client inserts on notifications (SECURITY DEFINER triggers bypass RLS)
CREATE POLICY "notifications no client insert" ON public.notifications
FOR INSERT TO authenticated, anon WITH CHECK (false);
