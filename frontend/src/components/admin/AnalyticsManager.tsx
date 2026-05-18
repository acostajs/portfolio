import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  RotateCw,
} from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { ChatMessage, ChatFeedback } from "../../types/cms";

const AnalyticsManager: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [feedback, setFeedback] = useState<ChatFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = {
        "X-Admin-Token": localStorage.getItem("admin-token") || "",
      };
      const [msgRes, fbRes] = await Promise.all([
        fetch("/api/v1/admin/analytics/messages", { headers }),
        fetch("/api/v1/admin/analytics/feedback", { headers }),
      ]);

      if (msgRes.ok) setMessages(await msgRes.json());
      if (fbRes.ok) setFeedback(await fbRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchData());
  }, [fetchData]);

  if (isLoading && messages.length === 0)
    return <div className="text-text">{t.admin.common.loading}</div>;

  const helpfulCount = feedback.filter((f) => f.is_helpful).length;
  const helpfulRatio =
    feedback.length > 0 ? (helpfulCount / feedback.length) * 100 : 0;

  // Feedback analysis by module
  const moduleFeedback = feedback.reduce(
    (acc, f) => {
      const key = f.module || "unknown";
      if (!acc[key]) acc[key] = { helpful: 0, unhelpful: 0 };
      if (f.is_helpful) acc[key].helpful++;
      else acc[key].unhelpful++;
      return acc;
    },
    {} as Record<string, { helpful: number; unhelpful: number }>,
  );

  const weakestModules = Object.entries(moduleFeedback)
    .map(([module, stats]) => ({
      module,
      unhelpfulRatio:
        (stats.unhelpful / (stats.helpful + stats.unhelpful)) * 100,
      total: stats.helpful + stats.unhelpful,
      unhelpful: stats.unhelpful,
    }))
    .filter((m) => m.unhelpful > 0)
    .sort((a, b) => b.unhelpfulRatio - a.unhelpfulRatio);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text-header">
          {t.admin.analytics.title}
        </h2>
        <button
          onClick={() => void fetchData()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-accent-bg border-2 border-border rounded-none shadow-shadow hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all text-xs font-black uppercase tracking-widest text-text-header disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          {t.admin.common.refresh || "Refresh"}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          icon={MessageSquare}
          label={t.admin.analytics.stats.totalMessages}
          value={messages.length.toString()}
          color="accent"
        />
        <StatCard
          icon={BarChart3}
          label={t.admin.analytics.stats.totalFeedback}
          value={feedback.length.toString()}
          color="accent"
        />
        <StatCard
          icon={ThumbsUp}
          label={t.admin.analytics.stats.helpfulRatio}
          value={`${helpfulRatio.toFixed(1)}%`}
          color={helpfulRatio >= 80 ? "accent" : "error"}
        />
      </div>

      {/* Weakest Modules Alert */}
      {weakestModules.length > 0 && (
        <section
          className="bg-error-bg border-4 border-error p-6 rounded-none shadow-shadow space-y-6"
          aria-labelledby="improvement-areas-title"
        >
          <h3
            id="improvement-areas-title"
            className="text-xl font-black uppercase italic tracking-tighter text-error flex items-center gap-2"
          >
            <ThumbsDown className="w-6 h-6" aria-hidden="true" />
            Areas for Improvement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weakestModules.slice(0, 6).map((m) => (
              <div
                key={m.module}
                className="bg-bg border-2 border-border p-4 rounded-none flex justify-between items-center shadow-shadow hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all"
                role="status"
              >
                <div>
                  <p className="text-[10px] font-black font-mono uppercase tracking-widest text-text opacity-70 mb-1">
                    {m.module}
                  </p>
                  <p className="text-2xl font-black italic tracking-tighter text-text-header tabular-nums">
                    {m.unhelpfulRatio.toFixed(0)}%
                    <span className="text-[10px] text-text opacity-60 ml-2 font-black uppercase tracking-wider">
                      negative
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-text opacity-60 uppercase font-black font-mono tracking-widest">
                    Count
                  </p>
                  <p className="text-sm font-black text-error tabular-nums">
                    {m.unhelpful} / {m.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Messages */}
        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-text-header flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-accent" />
            {t.admin.analytics.recentMessages}
          </h3>
          <div className="bg-bg border-4 border-border rounded-none shadow-shadow overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {messages.length > 0 ? (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 border-b-2 border-border last:border-0 hover:bg-accent-bg transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-none border border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${m.role === "user" ? "bg-accent text-white" : "bg-bg text-text"}`}
                      >
                        {m.role}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-text opacity-60">
                        {new Date(m.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-text-header leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-text opacity-60 italic font-black uppercase tracking-widest text-xs">
                  {t.admin.analytics.noData}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-text-header flex items-center gap-2">
            <ThumbsUp className="w-6 h-6 text-accent" />
            {t.admin.analytics.recentFeedback}
          </h3>
          <div className="bg-bg border-4 border-border rounded-none shadow-shadow overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {feedback.length > 0 ? (
                feedback.map((f) => (
                  <div
                    key={f.id}
                    className="p-5 border-b-2 border-border last:border-0 hover:bg-accent-bg transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className={`p-1 border border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${f.is_helpful ? "bg-accent" : "bg-error"}`}
                        >
                          {f.is_helpful ? (
                            <ThumbsUp className="w-3 h-3 text-white" />
                          ) : (
                            <ThumbsDown className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-black uppercase tracking-widest ${f.is_helpful ? "text-accent" : "text-error"}`}
                        >
                          {f.is_helpful
                            ? t.admin.analytics.helpful
                            : t.admin.analytics.notHelpful}
                        </span>
                        {f.module && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-none border border-border bg-bg text-text shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {f.module}
                          </span>
                        )}
                        {f.category && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-none border border-border bg-accent text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {f.category}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-text opacity-60">
                        {new Date(f.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-accent-bg p-3 border-2 border-border rounded-none">
                        <p className="text-[10px] text-text opacity-60 uppercase font-black font-mono mb-1">
                          User
                        </p>
                        <p className="text-xs font-medium text-text-header italic">
                          "{f.user_message}"
                        </p>
                      </div>
                      <div className="bg-bg p-3 border-2 border-border rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-[10px] text-accent opacity-60 uppercase font-black font-mono mb-1">
                          Assistant
                        </p>
                        <p className="text-xs font-medium text-text-header">
                          {f.assistant_reply}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-text opacity-60 italic font-black uppercase tracking-widest text-xs">
                  {t.admin.analytics.noData}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  color: "accent" | "error";
}> = ({ icon: Icon, label, value, color }) => (
  <div className="p-6 bg-bg border-4 border-border rounded-none shadow-shadow flex flex-col items-center text-center">
    <div
      className={`w-14 h-14 rounded-none border-2 border-border flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${color === "accent" ? "bg-accent" : "bg-error"}`}
    >
      <Icon className="w-7 h-7 text-white" />
    </div>
    <span className="text-xs font-black font-mono uppercase tracking-widest text-text opacity-70 mb-2">
      {label}
    </span>
    <div className="text-4xl font-black italic tracking-tighter text-text-header">
      {value}
    </div>
  </div>
);

export default AnalyticsManager;
