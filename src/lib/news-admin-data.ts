import { supabase } from "@/integrations/supabase/client";
import { api, apiBaseUrl, tokens, useNewApi } from "./api-client";

export type NewsStatus = "live" | "draft" | "scheduled";
export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  body?: string;
  category: string;
  tag: string;
  image_url: string | null;
  status: NewsStatus;
  publish_at: string | null;
  created_at: string;
  updated_at: string;
}

export type NewsPayload = {
  title: string;
  tag: string;
  category: string;
  excerpt: string;
  body: string;
  image_url: string | null;
  status: NewsStatus;
  publish_at: string | null;
};

export async function listNews(): Promise<NewsArticle[]> {
  if (useNewApi()) return api.get<NewsArticle[]>("/api/v1/news");
  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NewsArticle[];
}

export async function getNews(id: string): Promise<NewsArticle | null> {
  if (useNewApi()) {
    try { return await api.get<NewsArticle>(`/api/v1/news/${id}`); } catch { return null; }
  }
  const { data } = await supabase.from("news_articles").select("*").eq("id", id).maybeSingle();
  return (data as NewsArticle | null) ?? null;
}

export async function createNews(payload: NewsPayload, authorId: string): Promise<void> {
  if (useNewApi()) { await api.post("/api/v1/news", payload); return; }
  const { error } = await supabase.from("news_articles").insert({ ...payload, author_id: authorId });
  if (error) throw error;
}

export async function updateNews(id: string, payload: NewsPayload): Promise<void> {
  if (useNewApi()) { await api.patch(`/api/v1/news/${id}`, payload); return; }
  const { error } = await supabase.from("news_articles").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteNews(id: string): Promise<void> {
  if (useNewApi()) { await api.delete(`/api/v1/news/${id}`); return; }
  const { error } = await supabase.from("news_articles").delete().eq("id", id);
  if (error) throw error;
}

export async function publishNews(id: string): Promise<void> {
  if (useNewApi()) { await api.patch(`/api/v1/news/${id}`, { status: "live", publish_at: null }); return; }
  const { error } = await supabase.from("news_articles").update({ status: "live", publish_at: null }).eq("id", id);
  if (error) throw error;
}

export async function uploadNewsImage(file: File, ownerId: string): Promise<string> {
  if (useNewApi()) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${apiBaseUrl()}/api/v1/news/upload-image`, {
      method: "POST",
      headers: tokens.access ? { Authorization: `Bearer ${tokens.access}` } : undefined,
      body: form,
    });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const json = (await res.json()) as { url?: string; public_url?: string };
    const url = json.url ?? json.public_url;
    if (!url) throw new Error("Upload response missing url");
    return url;
  }
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${ownerId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("news-images").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("news-images").getPublicUrl(path);
  return data.publicUrl;
}
