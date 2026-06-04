import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

const CATEGORIES = ["Platform Updates", "Maintenance Tips", "Provider Stories", "Industry News", "Gold Members"];
const STATUSES = [
  { v: "draft", label: "Draft" },
  { v: "live", label: "Publish (Live)" },
  { v: "scheduled", label: "Scheduled" },
] as const;

interface Props {
  mode: "new" | "edit";
}

export function AdminNewsEditorPage({ mode }: Props) {
  const { profile } = useCurrentUser();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { username: string; id?: string };
  const username = params.username;

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Update");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "live" | "scheduled">("draft");
  const [publishAt, setPublishAt] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !params.id) return;
    (async () => {
      const { data, error } = await supabase.from("news_articles").select("*").eq("id", params.id!).maybeSingle();
      if (error || !data) {
        toast.error("Article not found");
        navigate({ to: "/$username/update-news", params: { username } });
        return;
      }
      setTitle(data.title);
      setTag(data.tag);
      setCategory(data.category);
      setExcerpt(data.excerpt);
      setBody(data.body);
      setImageUrl(data.image_url);
      setStatus(data.status as "draft" | "live" | "scheduled");
      setPublishAt(data.publish_at ? data.publish_at.slice(0, 16) : "");
      setLoading(false);
    })();
  }, [mode, params.id, username, navigate]);

  const handleImage = async (file: File) => {
    if (!profile) return;
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${profile.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("news-images").upload(path, file, { upsert: true });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("news-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!title.trim() || !excerpt.trim()) {
      toast.error("Title and excerpt are required");
      return;
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      tag: tag.trim() || "Update",
      category,
      excerpt: excerpt.trim(),
      body: body.trim(),
      image_url: imageUrl,
      status,
      publish_at: status === "scheduled" && publishAt ? new Date(publishAt).toISOString() : null,
    };

    if (mode === "new") {
      const { error } = await supabase.from("news_articles").insert({ ...payload, author_id: profile.id });
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Article created");
    } else {
      const { error } = await supabase.from("news_articles").update(payload).eq("id", params.id!);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Article updated");
    }
    navigate({ to: "/$username/update-news", params: { username } });
  };

  if (loading) {
    return (
      <AdminLayout active="news">
        <div className="flex h-64 items-center justify-center text-background/60">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="news">
      <button
        onClick={() => navigate({ to: "/$username/update-news", params: { username } })}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-background/60 hover:text-background"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to News
      </button>
      <h1 className="text-3xl font-bold">{mode === "new" ? "New Article" : "Edit Article"}</h1>
      <p className="mt-1 text-sm text-background/60">
        {mode === "new" ? "Write and publish a news update for the platform." : "Update the article details."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required
              className="w-full rounded-xl border border-background/10 bg-background/5 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </Field>

          <Field label="Excerpt (short summary)">
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={400} required rows={3}
              className="w-full resize-none rounded-xl border border-background/10 bg-background/5 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </Field>

          <Field label="Body content">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10}
              className="w-full resize-y rounded-xl border border-background/10 bg-background/5 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </Field>

          <Field label="Cover image">
            <div className="rounded-xl border border-dashed border-background/15 bg-background/5 p-5">
              {imageUrl ? (
                <div className="space-y-3">
                  <img src={imageUrl} alt="Cover" className="max-h-48 rounded-lg object-cover" />
                  <button type="button" onClick={() => setImageUrl(null)} className="text-xs font-semibold text-destructive">Remove</button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 py-6 text-center">
                  {uploading ? <Loader2 className="h-6 w-6 animate-spin text-background/60" /> : <Upload className="h-6 w-6 text-background/60" />}
                  <span className="text-xs text-background/60">{uploading ? "Uploading…" : "Click to upload an image (JPG, PNG)"}</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }} />
                </label>
              )}
            </div>
          </Field>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-background/10 bg-background/5 p-5 space-y-4">
            <Field label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full rounded-xl border border-background/10 bg-background/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                {STATUSES.map((s) => <option key={s.v} value={s.v} className="bg-foreground">{s.label}</option>)}
              </select>
            </Field>

            {status === "scheduled" && (
              <Field label="Publish at">
                <input type="datetime-local" value={publishAt} onChange={(e) => setPublishAt(e.target.value)}
                  className="w-full rounded-xl border border-background/10 bg-background/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </Field>
            )}

            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-background/10 bg-background/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                {CATEGORIES.map((c) => <option key={c} value={c} className="bg-foreground">{c}</option>)}
              </select>
            </Field>

            <Field label="Tag (small label)">
              <input value={tag} onChange={(e) => setTag(e.target.value)} maxLength={40}
                className="w-full rounded-xl border border-background/10 bg-background/5 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </Field>
          </div>

          <button type="submit" disabled={saving}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving…" : mode === "new" ? "Create Article" : "Save Changes"}
          </button>
        </aside>
      </form>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-background/70">{label}</span>
      {children}
    </label>
  );
}
