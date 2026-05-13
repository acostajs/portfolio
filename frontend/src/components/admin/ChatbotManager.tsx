import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import TagInput from "../ui/TagInput";

const ChatbotManager: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ChatbotResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ChatbotResponse | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/chat-triggers", {
        headers: {
          "X-Admin-Token": localStorage.getItem("admin-token") || "",
        },
      });
      if (response.ok) {
        setItems(await response.json());
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
      ? "/api/v1/admin/chat-triggers"
      : `/api/v1/admin/chat-triggers/${editingItem.id}`;
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
        toast.success(isNew ? "Trigger created" : "Trigger updated");
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
      const response = await fetch(`/api/v1/admin/chat-triggers/${id}`, {
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
        <h2 className="text-2xl font-bold text-text-header">
          {t.admin.chatbot.title}
        </h2>
        <button
          onClick={() =>
            setEditingItem({
              module: "custom",
              triggers: [],
              answers_en: [],
              answers_es: [],
              answers_fr: [],
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> {t.admin.chatbot.newTrigger}
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
                {t.admin.chatbot.module}
              </label>
              <input
                required
                value={editingItem.module}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, module: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
                placeholder="greetings, about, ..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                {t.admin.chatbot.category}
              </label>
              <input
                value={editingItem.category || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              {t.admin.chatbot.triggers}
            </label>
            <TagInput
              tags={editingItem.triggers}
              onChange={(newTriggers) =>
                setEditingItem({ ...editingItem, triggers: newTriggers })
              }
              placeholder="e.g. hello, hi, greetings"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest text-accent">
                {t.admin.chatbot.answersEn}
              </label>
              <textarea
                required
                value={editingItem.answers_en.join("\n")}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    answers_en: e.target.value.split("\n").filter((l) => l),
                  })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header min-h-[80px] text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest text-accent">
                {t.admin.chatbot.answersEs}
              </label>
              <textarea
                required
                value={editingItem.answers_es.join("\n")}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    answers_es: e.target.value.split("\n").filter((l) => l),
                  })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header min-h-[80px] text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest text-accent">
                {t.admin.chatbot.answersFr}
              </label>
              <textarea
                required
                value={editingItem.answers_fr.join("\n")}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    answers_fr: e.target.value.split("\n").filter((l) => l),
                  })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header min-h-[80px] text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-accent/20"
            >
              {editingItem.id ? t.admin.chatbot.update : t.admin.chatbot.create}
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
                    {item.module}
                  </h3>
                  {item.category && (
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] uppercase font-bold rounded border border-accent/20">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-text opacity-50 text-xs mt-1">
                  Triggers: {item.triggers.slice(0, 5).join(", ")}
                  {item.triggers.length > 5 ? "..." : ""}
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

export default ChatbotManager;
