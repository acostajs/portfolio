import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { ProjectData } from "../../types/cms";

const ProjectsManager: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ProjectData | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/projects", {
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
      ? "/api/v1/admin/projects"
      : `/api/v1/admin/projects/${editingItem.id}`;
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
        toast.success(isNew ? "Project added" : "Project updated");
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
      const response = await fetch(`/api/v1/admin/projects/${id}`, {
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

  const handleImageUpload = async (projectId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `/api/v1/admin/projects/${projectId}/upload-image`,
        {
          method: "POST",
          headers: {
            "X-Admin-Password": localStorage.getItem("admin-token") || "",
          },
          body: formData,
        },
      );
      if (response.ok) {
        const data = await response.json();
        toast.success("Image uploaded successfully");
        if (editingItem && editingItem.id === projectId) {
          setEditingItem({ ...editingItem, image: data.image_url });
        }
        void fetchItems();
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image");
    }
  };

  if (isLoading)
    return <div className="text-text">{t.admin.common.loading}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-header">
          {t.admin.projects.title}
        </h2>
        <button
          onClick={() =>
            setEditingItem({
              title: "",
              description_en: "",
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
          className="bg-white/5 border border-accent/30 p-8 rounded-3xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.projects.projectTitle}
              </label>
              <input
                required
                value={editingItem.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.projects.order}
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

          <div className="space-y-4">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              {t.admin.projects.image}
            </label>
            <div className="flex items-center gap-6 p-4 bg-white/5 border border-border rounded-2xl">
              <div className="w-32 h-20 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center border border-border">
                {editingItem.image ? (
                  <img
                    src={editingItem.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-text opacity-20" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && editingItem.id) {
                      handleImageUpload(editingItem.id, file);
                    } else if (file) {
                      toast.info(t.admin.projects.saveFirst);
                    }
                  }}
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-text-header text-sm font-bold rounded-xl cursor-pointer transition-all w-fit"
                >
                  <Upload className="w-4 h-4" />
                  {editingItem.image
                    ? t.admin.projects.changeImage
                    : t.admin.projects.upload}
                </label>
                <p className="text-[10px] text-text opacity-40">
                  {t.admin.projects.imageHint}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.projects.github}
              </label>
              <input
                value={editingItem.github || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, github: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.projects.live}
              </label>
              <input
                value={editingItem.link || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, link: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              {t.admin.projects.description}
            </label>
            <textarea
              required
              value={editingItem.description_en}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  description_en: e.target.value,
                })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              {t.admin.projects.tech}
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
              {editingItem.id ? t.admin.projects.update : t.admin.projects.add}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white/5 border border-border rounded-2xl group hover:border-accent/30 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-text-header text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-text opacity-60 text-sm line-clamp-2">
                  {item.description_en}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
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

export default ProjectsManager;
