import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { ExperienceData } from "../../types/cms";

const ExperienceManager: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ExperienceData | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/experience", {
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
      ? "/api/v1/admin/experience"
      : `/api/v1/admin/experience/${editingItem.id}`;
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
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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
        <h2 className="text-2xl font-bold text-text-header">
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
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> {t.admin.common.add}
        </button>
      </div>

      {editingItem ? (
        <form
          onSubmit={handleSave}
          className="bg-white/5 border border-accent/30 p-8 rounded-3xl space-y-6 relative animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.experience.company}
              </label>
              <input
                required
                value={editingItem.company}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, company: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.experience.role}
              </label>
              <input
                required
                value={editingItem.role}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, role: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.experience.period}
              </label>
              <input
                required
                value={editingItem.period}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, period: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
                placeholder="2023 - Present"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
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
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
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
              className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              {t.admin.experience.tech}
            </label>
            <input
              value={editingItem.tech.join(", ")}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  tech: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s),
                })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-accent/20"
            >
              {editingItem.id
                ? t.admin.experience.update
                : t.admin.experience.add}
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
                <h3 className="font-bold text-text-header text-lg">
                  {item.role}
                </h3>
                <p className="text-accent text-sm font-medium">
                  {item.company}
                </p>
                <p className="text-text opacity-50 text-xs mt-1">
                  {item.period}
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

export default ExperienceManager;
