-- Drop the existing INSERT policy and replace with one that checks habit ownership
DROP POLICY "Users can create their own logs" ON public.habit_logs;

CREATE POLICY "Users can create their own logs"
ON public.habit_logs
FOR INSERT
TO public
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.habits
    WHERE habits.id = habit_id
    AND habits.user_id = auth.uid()
  )
);