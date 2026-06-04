
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'admin');
$$;

CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Platform Updates',
  tag text NOT NULL DEFAULT 'Update',
  image_url text,
  status text NOT NULL DEFAULT 'draft',
  publish_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT news_status_check CHECK (status IN ('draft','scheduled','live'))
);

GRANT SELECT ON public.news_articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_articles TO authenticated;
GRANT ALL ON public.news_articles TO service_role;

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news live readable by all"
  ON public.news_articles FOR SELECT
  TO anon, authenticated
  USING (status = 'live' OR public.is_admin(auth.uid()));

CREATE POLICY "news admin insert"
  ON public.news_articles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()) AND auth.uid() = author_id);

CREATE POLICY "news admin update"
  ON public.news_articles FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "news admin delete"
  ON public.news_articles FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER news_articles_touch
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
