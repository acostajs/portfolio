import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { ProjectData } from "../../types/cms";
import ProgressiveImage from "../chat/ProgressiveImage";
import TagInput from "../ui/TagInput";

const ProjectsManager: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ProjectData | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/projects");
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
          "X-Admin-Token": localStorage.getItem("admin-token") || "",
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

  const handleImageUpload = async (projectId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `/api/v1/admin/projects/${projectId}/upload-image`,
        {
          method: "POST",
          headers: {
            "X-Admin-Token": localStorage.getItem("admin-token") || "",
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
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text-header">
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
                {t.admin.projects.projectTitle}
              </label>
              <input
                required
                value={editingItem.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
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
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
              {t.admin.projects.image}
            </label>
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-accent-bg border-2 border-border rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="relative w-48 h-32 bg-bg rounded-none overflow-hidden flex items-center justify-center border-2 border-border group/preview shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {editingItem.image ? (
                  <>
                    <ProgressiveImage
                      src={editingItem.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingItem({ ...editingItem, image: undefined })
                      }
                      className="absolute top-2 right-2 p-1.5 bg-error text-white border border-border rounded-none opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="w-10 h-10 text-text opacity-20" />
                )}
              </div>
              <div className="flex-1 space-y-4">
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
                  className="flex items-center gap-2 px-6 py-3 bg-bg border-2 border-border text-text-header text-xs font-black uppercase tracking-widest rounded-none cursor-pointer transition-all w-fit shadow-shadow hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0"
                >
                  <Upload className="w-4 h-4" />
                  {editingItem.image
                    ? t.admin.projects.changeImage
                    : t.admin.projects.upload}
                </label>
                <p className="text-[10px] font-mono font-bold uppercase text-text opacity-60">
                  {t.admin.projects.imageHint}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.projects.github}
              </label>
              <input
                value={editingItem.github || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, github: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.projects.live}
              </label>
              <input
                value={editingItem.link || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, link: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
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
              className="w-full p-4 bg-accent-bg border-2 border-border rounded-none text-text-header font-medium min-h-[100px] focus:outline-none focus:border-accent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
              {t.admin.projects.tech}
            </label>
            <TagInput
              tags={editingItem.tech}
              onChange={(newTech) =>
                setEditingItem({ ...editingItem, tech: newTech })
              }
              placeholder="e.g. React, Bun, Tailwind"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-accent text-white rounded-none border-2 border-border shadow-shadow font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
            >
              {editingItem.id ? t.admin.projects.update : t.admin.projects.add}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-bg border-4 border-border rounded-none shadow-shadow group hover:border-accent transition-all flex flex-col gap-6"
            >
              <div className="flex gap-6">
                <div className="w-24 h-20 bg-accent-bg rounded-none overflow-hidden border-2 border-border flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {item.image ? (
                    <ProgressiveImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-text-header text-xl uppercase italic tracking-tighter mb-2 truncate">
                    {item.title}
                  </h3>
                  <p className="text-text opacity-70 text-xs font-medium line-clamp-2 italic">
                    {item.description_en}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-auto pt-4 border-t-2 border-border">
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

export default ProjectsManager;
