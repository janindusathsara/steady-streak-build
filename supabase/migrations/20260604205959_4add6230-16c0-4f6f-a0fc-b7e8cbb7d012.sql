
CREATE POLICY "news images public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'news-images');

CREATE POLICY "news images admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'news-images' AND public.is_admin(auth.uid()));

CREATE POLICY "news images admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'news-images' AND public.is_admin(auth.uid()));

CREATE POLICY "news images admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'news-images' AND public.is_admin(auth.uid()));
