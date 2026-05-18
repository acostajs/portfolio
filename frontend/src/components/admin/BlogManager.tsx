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
          "X-Admin-Token": localStorage.getItem("admin-token") || "",
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
          "X-Admin-Token": localStorage.getItem("admin-token") || "",
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
          "X-Admin-Token": localStorage.getItem("admin-token") || "",
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
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text-header">
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
          className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-none border-2 border-border shadow-shadow font-black uppercase tracking-widest text-xs hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
        >
          <Plus className="w-4 h-4" /> {t.admin.blog.newPost}
        </button>
      </div>

      {editingItem ? (
        <form
          onSubmit={handleSave}
          className="bg-bg border-4 border-accent p-8 rounded-none shadow-shadow space-y-8 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.blog.slug}
              </label>
              <input
                required
                value={editingItem.slug}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, slug: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent"
                placeholder="my-post-slug"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.blog.date}
              </label>
              <input
                type="date"
                required
                value={editingItem.date}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, date: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.blog.category}
              </label>
              <input
                required
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-bg border-2 border-border rounded-none space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xs font-black text-accent uppercase tracking-widest italic">
                {t.admin.blog.contentTitle} (EN)
              </h3>
              <input
                required
                value={editingItem.title_en}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title_en: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-black uppercase italic tracking-tighter text-lg focus:outline-none focus:border-accent"
                placeholder={t.admin.blog.postTitle}
              />
              <textarea
                required
                value={editingItem.excerpt_en}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, excerpt_en: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header text-sm font-medium focus:outline-none focus:border-accent"
                placeholder={t.admin.blog.excerpt}
                rows={2}
              />
              <textarea
                required
                value={editingItem.content_en}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, content_en: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header text-sm font-mono focus:outline-none focus:border-accent"
                placeholder={t.admin.blog.content}
                rows={10}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-12 h-6 rounded-none border-2 border-border p-1 transition-colors ${editingItem.published ? "bg-accent" : "bg-bg"}`}
              >
                <div
                  className={`w-4 h-4 bg-white border border-border rounded-none transition-transform ${editingItem.published ? "translate-x-6" : ""}`}
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
              <span className="text-xs font-black uppercase tracking-widest text-text-header">
                {t.admin.common.published}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-accent text-white rounded-none border-2 border-border shadow-shadow font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
            >
              {editingItem.id ? t.admin.blog.update : t.admin.blog.create}
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-8 py-4 bg-bg border-2 border-border text-text rounded-none font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all shadow-shadow"
            >
              {t.admin.common.cancel}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-6 bg-bg border-4 border-border rounded-none shadow-shadow group hover:border-accent transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-black text-text-header text-xl uppercase italic tracking-tighter">
                    {item.title_en}
                  </h3>
                  {!item.published && (
                    <span className="px-2 py-0.5 bg-error text-white text-[10px] uppercase font-black border border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {t.admin.common.draft}
                    </span>
                  )}
                </div>
                <p className="text-accent text-[10px] font-black font-mono uppercase tracking-widest">
                  {item.category} • {item.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-text border-2 border-transparent hover:border-border hover:bg-accent-bg hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
                >
                  <Edit className="w-5 h-5" />
                </button>
                {item.id !== undefined && (
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-2 text-text hover:text-error border-2 border-transparent hover:border-error hover:bg-error-bg hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
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
