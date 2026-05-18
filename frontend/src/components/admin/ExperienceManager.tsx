import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { ExperienceData } from "../../types/cms";
import TagInput from "../ui/TagInput";

const ExperienceManager: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ExperienceData | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/experience");
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
      ? "/api/v1/admin/experience"
      : `/api/v1/admin/experience/${editingItem.id}`;
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
        toast.success(isNew ? "Experience added" : "Experience updated");
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
      const response = await fetch(`/api/v1/admin/experience/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Token": localStorage.getItem("admin-token") || "",
        },
      });
      if (response.ok) {
        toast.success("Deleted successfully");
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
          {t.admin.experience.title}
        </h2>
        <button
          onClick={() =>
            setEditingItem({
              company: "",
              role: "",
              period: "",
              description_en: [],
              tech: [],
              order: items.length,
            })
          }
          className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-none border-2 border-border shadow-shadow font-black uppercase tracking-widest text-xs hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
        >
          <Plus className="w-4 h-4" /> {t.admin.common.add}
        </button>
      </div>

      {editingItem ? (
        <form
          onSubmit={handleSave}
          className="bg-bg border-4 border-accent p-8 rounded-none shadow-shadow space-y-8 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.experience.company}
              </label>
              <input
                required
                value={editingItem.company}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, company: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.experience.role}
              </label>
              <input
                required
                value={editingItem.role}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, role: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.experience.period}
              </label>
              <input
                required
                value={editingItem.period}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, period: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
                placeholder="2023 - Present"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.experience.order}
              </label>
              <input
                type="number"
                value={editingItem.order}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    order: parseInt(e.target.value),
                  })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
              {t.admin.experience.description}
            </label>
            <textarea
              value={editingItem.description_en.join("\n")}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  description_en: e.target.value.split("\n").filter((l) => l),
                })
              }
              className="w-full p-4 bg-accent-bg border-2 border-border rounded-none text-text-header font-medium min-h-[120px] focus:outline-none focus:border-accent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
              {t.admin.experience.tech}
            </label>
            <TagInput
              tags={editingItem.tech}
              onChange={(newTech) =>
                setEditingItem({ ...editingItem, tech: newTech })
              }
              placeholder="e.g. FastAPI, Docker, AWS"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-accent text-white rounded-none border-2 border-border shadow-shadow font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
            >
              {editingItem.id
                ? t.admin.experience.update
                : t.admin.experience.add}
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
                <h3 className="font-black text-text-header text-xl uppercase italic tracking-tighter mb-1">
                  {item.role}
                </h3>
                <p className="text-accent text-xs font-black uppercase tracking-widest mb-1">
                  {item.company}
                </p>
                <p className="text-text opacity-70 text-[10px] font-mono font-bold uppercase">
                  {item.period}
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

export default ExperienceManager;
