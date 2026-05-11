import React, { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { AboutData } from "../../types/cms";

const AboutManager: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAbout = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/about", {
        headers: {
          "X-Admin-Token": localStorage.getItem("admin-token") || "",
        },
      });
      if (response.ok) {
        const json = await response.json();
        setData(json);
      } else {
        toast.error("Failed to fetch about data");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchAbout());
  }, [fetchAbout]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback(10);
    setIsSaving(true);
    try {
      const response = await fetch("/api/v1/admin/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": localStorage.getItem("admin-token") || "",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success("About content updated");
      } else {
        toast.error("Failed to update content");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="animate-pulse text-text">{t.admin.common.loading}</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-header">
          {t.admin.about.title}
        </h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
        >
          {isSaving ? (
            t.admin.common.saving
          ) : (
            <>
              <Save className="w-4 h-4" /> {t.admin.common.saveChanges}
            </>
          )}
        </button>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EN */}
        <div className="space-y-4 bg-white/5 border border-border p-6 rounded-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">
            {t.admin.about.en}
          </h3>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">
              {t.admin.about.p1}
            </label>
            <textarea
              value={data?.p1_en || ""}
              onChange={(e) =>
                data && setData({ ...data, p1_en: e.target.value })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">
              {t.admin.about.p2}
            </label>
            <textarea
              value={data?.p2_en || ""}
              onChange={(e) =>
                data && setData({ ...data, p2_en: e.target.value })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[100px]"
            />
          </div>
        </div>

        {/* ES */}
        <div className="space-y-4 bg-white/5 border border-border p-6 rounded-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">
            {t.admin.about.es}
          </h3>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">
              {t.admin.about.p1}
            </label>
            <textarea
              value={data?.p1_es || ""}
              onChange={(e) =>
                data && setData({ ...data, p1_es: e.target.value })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">
              {t.admin.about.p2}
            </label>
            <textarea
              value={data?.p2_es || ""}
              onChange={(e) =>
                data && setData({ ...data, p2_es: e.target.value })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[100px]"
            />
          </div>
        </div>

        {/* FR */}
        <div className="space-y-4 bg-white/5 border border-border p-6 rounded-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">
            {t.admin.about.fr}
          </h3>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">
              {t.admin.about.p1}
            </label>
            <textarea
              value={data?.p1_fr || ""}
              onChange={(e) =>
                data && setData({ ...data, p1_fr: e.target.value })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">
              {t.admin.about.p2}
            </label>
            <textarea
              value={data?.p2_fr || ""}
              onChange={(e) =>
                data && setData({ ...data, p2_fr: e.target.value })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[100px]"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4 bg-white/5 border border-border p-6 rounded-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">
            {t.admin.about.skills}
          </h3>
          <textarea
            value={data?.skills?.join(", ") || ""}
            onChange={(e) =>
              data &&
              setData({
                ...data,
                skills: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
              })
            }
            className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[150px]"
            placeholder="TypeScript, React, ..."
          />
        </div>
      </form>
    </div>
  );
};

export default AboutManager;
