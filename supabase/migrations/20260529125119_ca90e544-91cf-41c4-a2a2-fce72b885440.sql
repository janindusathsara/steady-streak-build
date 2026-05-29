REVOKE EXECUTE ON FUNCTION public.prevent_profile_role_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_provider_protected_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.restrict_booking_homeowner_update() FROM PUBLIC, anon, authenticated;