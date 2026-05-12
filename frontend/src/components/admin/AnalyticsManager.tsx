import React, { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, BarChart3 } from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { ChatMessage, ChatFeedback } from "../../types/cms";

const AnalyticsManager: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [feedback, setFeedback] = useState<ChatFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    void fetchData();
  }, []);

  if (isLoading)
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
        <h2 className="text-2xl font-bold text-text-header">
          {t.admin.analytics.title}
        </h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          className="bg-error/5 border border-error/20 rounded-3xl p-6 space-y-4"
          aria-labelledby="improvement-areas-title"
        >
          <h3
            id="improvement-areas-title"
            className="text-lg font-bold text-error flex items-center gap-2"
          >
            <ThumbsDown className="w-5 h-5" aria-hidden="true" />
            Areas for Improvement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakestModules.slice(0, 6).map((m) => (
              <div
                key={m.module}
                className="bg-white/5 border border-border/50 p-4 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-colors"
                role="status"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text opacity-50 mb-1">
                    {m.module}
                  </p>
                  <p className="text-xl font-bold text-text-header tabular-nums">
                    {m.unhelpfulRatio.toFixed(0)}%
                    <span className="text-[10px] text-text opacity-40 ml-2 font-normal uppercase tracking-wider">
                      negative
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-text opacity-40 uppercase font-bold tracking-widest">
                    Count
                  </p>
                  <p className="text-sm font-bold text-error tabular-nums">
                    {m.unhelpful} / {m.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text-header flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" />
            {t.admin.analytics.recentMessages}
          </h3>
          <div className="bg-white/5 border border-border rounded-2xl overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {messages.length > 0 ? (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 border-b border-border last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${m.role === "user" ? "bg-accent/10 text-accent" : "bg-white/10 text-text"}`}
                      >
                        {m.role}
                      </span>
                      <span className="text-[10px] text-text opacity-40">
                        {new Date(m.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-text-header leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-text opacity-50 italic">
                  {t.admin.analytics.noData}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text-header flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-accent" />
            {t.admin.analytics.recentFeedback}
          </h3>
          <div className="bg-white/5 border border-border rounded-2xl overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {feedback.length > 0 ? (
                feedback.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 border-b border-border last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {f.is_helpful ? (
                          <ThumbsUp className="w-4 h-4 text-accent" />
                        ) : (
                          <ThumbsDown className="w-4 h-4 text-error" />
                        )}
                        <span
                          className={`text-xs font-bold ${f.is_helpful ? "text-accent" : "text-error"}`}
                        >
                          {f.is_helpful
                            ? t.admin.analytics.helpful
                            : t.admin.analytics.notHelpful}
                        </span>
                      </div>
                      <span className="text-[10px] text-text opacity-40">
                        {new Date(f.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white/5 p-2 rounded-lg">
                        <p className="text-[10px] text-text opacity-40 uppercase font-bold mb-1">
                          User
                        </p>
                        <p className="text-xs text-text-header">
                          {f.user_message}
                        </p>
                      </div>
                      <div className="bg-accent/5 p-2 rounded-lg">
                        <p className="text-[10px] text-accent opacity-40 uppercase font-bold mb-1">
                          Assistant
                        </p>
                        <p className="text-xs text-text-header">
                          {f.assistant_reply}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-text opacity-50 italic">
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
  <div className="p-6 bg-white/5 border border-border rounded-3xl">
    <div className="flex items-center gap-4 mb-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === "accent" ? "bg-accent/10" : "bg-error/10"}`}
      >
        <Icon
          className={`w-5 h-5 ${color === "accent" ? "text-accent" : "text-error"}`}
        />
      </div>
      <span className="text-sm font-medium text-text opacity-60">{label}</span>
    </div>
    <div className="text-3xl font-bold text-text-header">{value}</div>
  </div>
);

export default AnalyticsManager;
