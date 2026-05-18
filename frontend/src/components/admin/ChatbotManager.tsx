import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { ChatTriggerResponse } from "../../types/cms";
import TagInput from "../ui/TagInput";

const ChatbotManager: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ChatTriggerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ChatTriggerResponse | null>(
    null,
  );

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
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text-header">
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
              priority: 0,
            })
          }
          className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-none border-2 border-border shadow-shadow font-black uppercase tracking-widest text-xs hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
        >
          <Plus className="w-4 h-4" /> {t.admin.chatbot.newTrigger}
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
                {t.admin.chatbot.module}
              </label>
              <input
                required
                value={editingItem.module}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, module: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
                placeholder="greetings, about, ..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.chatbot.category}
              </label>
              <input
                value={editingItem.category || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
                {t.admin.chatbot.priority}
              </label>
              <input
                type="number"
                value={editingItem.priority}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    priority: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-3 bg-accent-bg border-2 border-border rounded-none text-text-header font-bold focus:outline-none focus:border-accent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase text-text opacity-70 tracking-widest">
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

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-accent tracking-widest">
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
                className="w-full p-4 bg-accent-bg border-2 border-border rounded-none text-text-header font-medium min-h-[100px] text-sm focus:outline-none focus:border-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-accent tracking-widest">
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
                className="w-full p-4 bg-accent-bg border-2 border-border rounded-none text-text-header font-medium min-h-[100px] text-sm focus:outline-none focus:border-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-accent tracking-widest">
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
                className="w-full p-4 bg-accent-bg border-2 border-border rounded-none text-text-header font-medium min-h-[100px] text-sm focus:outline-none focus:border-accent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-accent text-white rounded-none border-2 border-border shadow-shadow font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
            >
              {editingItem.id ? t.admin.chatbot.update : t.admin.chatbot.create}
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
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-black text-text-header text-xl uppercase italic tracking-tighter">
                    {item.module}
                  </h3>
                  {item.category && (
                    <span className="px-2 py-0.5 bg-accent text-white text-[10px] uppercase font-black border border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {item.category}
                    </span>
                  )}
                  {item.priority > 0 && (
                    <span className="px-2 py-0.5 bg-success text-white text-[10px] uppercase font-black border border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      P{item.priority}
                    </span>
                  )}
                </div>
                <p className="text-text opacity-70 text-[10px] font-mono font-bold uppercase tracking-widest">
                  Triggers: {item.triggers.slice(0, 5).join(", ")}
                  {item.triggers.length > 5 ? "..." : ""}
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

export default ChatbotManager;
