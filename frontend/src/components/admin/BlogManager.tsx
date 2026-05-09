import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { BlogPost } from "../../types/cms";

const BlogManager: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/blog", {
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
        },
      });
      if (response.ok) {
        const json = await response.json();
        setItems(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchItems());
  }, [fetchItems]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    hapticFeedback(10);
    const isNew = !editingItem.id;
    const url = isNew
      ? "/api/v1/admin/blog"
      : `/api/v1/admin/blog/${editingItem.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
        },
        body: JSON.stringify(editingItem),
      });
      if (response.ok) {
        toast.success(isNew ? "Post created" : "Post updated");
        setEditingItem(null);
        void fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.admin.common.confirmDelete)) return;
    hapticFeedback(20);
    try {
      const response = await fetch(`/api/v1/admin/blog/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
        },
      });
      if (response.ok) {
        toast.success("Deleted");
        void fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return <div className="text-text">{t.admin.common.loading}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-header">
          {t.admin.blog.title}
        </h2>
        <button
          onClick={() =>
            setEditingItem({
              slug: "",
              date: new Date().toISOString().split("T")[0],
              category: "General",
              title_en: "",
              title_es: "",
              title_fr: "",
              excerpt_en: "",
              excerpt_es: "",
              excerpt_fr: "",
              content_en: "",
              content_es: "",
              content_fr: "",
              published: true,
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> {t.admin.blog.newPost}
        </button>
      </div>

      {editingItem ? (
        <form
          onSubmit={handleSave}
          className="bg-white/5 border border-accent/30 p-8 rounded-3xl space-y-8 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.blog.slug}
              </label>
              <input
                required
                value={editingItem.slug}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, slug: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
                placeholder="my-post-slug"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.blog.date}
              </label>
              <input
                type="date"
                required
                value={editingItem.date}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, date: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.blog.category}
              </label>
              <input
                required
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 border border-border rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-accent uppercase tracking-tighter">
                {t.admin.blog.contentTitle}
              </h3>
              <input
                required
                value={editingItem.title_en}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title_en: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header font-bold"
                placeholder={t.admin.blog.postTitle}
              />
              <textarea
                required
                value={editingItem.excerpt_en}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, excerpt_en: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text opacity-70 text-sm"
                placeholder={t.admin.blog.excerpt}
                rows={2}
              />
              <textarea
                required
                value={editingItem.content_en}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, content_en: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header text-sm font-mono"
                placeholder={t.admin.blog.content}
                rows={10}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${editingItem.published ? "bg-accent" : "bg-white/10"}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${editingItem.published ? "translate-x-6" : ""}`}
                />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={editingItem.published}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    published: e.target.checked,
                  })
                }
              />
              <span className="text-sm font-medium text-text-header">
                {t.admin.common.published}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-accent/20"
            >
              {editingItem.id ? t.admin.blog.update : t.admin.blog.create}
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-6 py-3 bg-white/5 border border-border text-text rounded-xl font-bold hover:bg-white/10"
            >
              {t.admin.common.cancel}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-6 bg-white/5 border border-border rounded-2xl group hover:border-accent/30 transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-text-header text-lg">
                    {item.title_en}
                  </h3>
                  {!item.published && (
                    <span className="px-2 py-0.5 bg-white/10 text-text opacity-50 text-[10px] uppercase font-bold rounded">
                      {t.admin.common.draft}
                    </span>
                  )}
                </div>
                <p className="text-accent text-xs font-medium">
                  {item.category} • {item.date}
                </p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-text hover:text-accent hover:bg-accent/10 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {item.id !== undefined && (
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-2 text-text hover:text-error hover:bg-error/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
