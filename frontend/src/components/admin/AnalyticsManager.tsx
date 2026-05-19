import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  RotateCw,
  Users,
  Eye,
  Activity,
  Server,
} from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import type { ChatMessage, ChatFeedback } from "../../types/cms";

interface VisitorSummary {
  total_visitors: number;
  unique_visitors: number;
  total_sessions: number;
  popular_pages: { path: string; count: number }[];
}

interface HealthDetails {
  status: string;
  components: {
    database: { status: string; latency_ms: number };
    system: { memory_usage_mb: number; disk_usage_percent: number };
  };
}

const AnalyticsManager: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [feedback, setFeedback] = useState<ChatFeedback[]>([]);
  const [summary, setSummary] = useState<VisitorSummary | null>(null);
  const [health, setHealth] = useState<HealthDetails | null>(null);
  const [activeView, setActiveView] = useState<"chat" | "activity" | "health">(
    "chat",
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = {
        "X-Admin-Token": localStorage.getItem("admin-token") || "",
      };
      const [msgRes, fbRes, sumRes, healthRes] = await Promise.all([
        fetch("/api/v1/admin/analytics/messages", { headers }),
        fetch("/api/v1/admin/analytics/feedback", { headers }),
        fetch("/api/v1/admin/analytics/summary", { headers }),
        fetch("/api/v1/admin/monitoring/health/details", { headers }),
      ]);

      if (msgRes.ok) setMessages(await msgRes.json());
      if (fbRes.ok) setFeedback(await fbRes.json());
      if (sumRes.ok) setSummary(await sumRes.json());
      if (healthRes.ok) setHealth(await healthRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchData());
  }, [fetchData]);

  if (isLoading && !summary)
    return <div className="text-bg-accent p-8">{t.admin.common.loading}</div>;

  const helpfulCount = feedback.filter((f) => f.is_helpful).length;
  const helpfulRatio =
    feedback.length > 0 ? (helpfulCount / feedback.length) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text-header">
          {t.admin.analytics.title}
        </h2>
        <div className="flex items-center gap-2">
          <div
            className="flex bg-accent-bg border-2 border-border p-1"
            role="tablist"
          >
            <button
              role="tab"
              aria-selected={activeView === "chat"}
              onClick={() => setActiveView("chat")}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === "chat" ? "bg-accent text-white" : "text-text hover:bg-accent/10"}`}
            >
              {t.admin.analytics.tabs.chat}
            </button>
            <button
              role="tab"
              aria-selected={activeView === "activity"}
              onClick={() => setActiveView("activity")}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === "activity" ? "bg-accent text-white" : "text-text hover:bg-accent/10"}`}
            >
              {t.admin.analytics.tabs.activity}
            </button>
            <button
              role="tab"
              aria-selected={activeView === "health"}
              onClick={() => setActiveView("health")}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === "health" ? "bg-accent text-white" : "text-text hover:bg-accent/10"}`}
            >
              {t.admin.analytics.tabs.health}
            </button>
          </div>
          <button
            onClick={() => void fetchData()}
            disabled={isLoading}
            aria-label={t.admin.common.refresh}
            className="flex items-center gap-2 px-4 py-2 bg-bg border-2 border-border rounded-none shadow-shadow hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all text-xs font-black uppercase tracking-widest text-text-header disabled:opacity-50"
          >
            <RotateCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {activeView === "chat" && (
        <div role="tabpanel">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            {/* Recent Messages */}
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-text-header flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-accent" />
                {t.admin.analytics.recentMessages}
              </h3>
              <div className="bg-bg border-4 border-border rounded-none shadow-shadow overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  {messages.map((m) => (
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
                  ))}
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
                  {feedback.map((f) => (
                    <div
                      key={f.id}
                      className="p-5 border-b-2 border-border last:border-0 hover:bg-accent-bg transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
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
                        </div>
                        <span className="text-[10px] font-mono font-bold text-text opacity-60">
                          {new Date(f.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-text-header italic bg-accent-bg p-2 border-l-4 border-accent mb-2">
                        "{f.user_message}"
                      </p>
                      <p className="text-xs font-medium text-text italic opacity-70">
                        {f.assistant_reply}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === "activity" && summary && (
        <div role="tabpanel" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              icon={Users}
              label={t.admin.analytics.stats.totalViews}
              value={summary.total_visitors.toString()}
              color="accent"
            />
            <StatCard
              icon={Activity}
              label={t.admin.analytics.stats.uniqueVisitors}
              value={summary.unique_visitors.toString()}
              color="accent"
            />
            <StatCard
              icon={BarChart3}
              label={t.admin.analytics.stats.chatSessions}
              value={summary.total_sessions.toString()}
              color="accent"
            />
          </div>

          <div className="bg-bg border-4 border-border p-8 shadow-shadow">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-text-header flex items-center gap-2 mb-6">
              <Eye className="w-6 h-6 text-accent" />
              {t.admin.analytics.activity.popularContent}
            </h3>
            <div className="space-y-6">
              {summary.popular_pages.map((p) => (
                <div key={p.path} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black font-mono text-text-header">
                      {p.path}
                    </span>
                    <span className="text-xs font-black text-accent tabular-nums">
                      {p.count} {t.admin.analytics.activity.views}
                    </span>
                  </div>
                  <div className="h-4 bg-accent-bg border-2 border-border overflow-hidden">
                    <div
                      className="h-full bg-accent border-r-2 border-border"
                      style={{
                        width: `${(p.count / (summary.total_visitors || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === "health" && health && (
        <div role="tabpanel" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-bg border-4 border-border p-8 shadow-shadow space-y-6">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-text-header flex items-center gap-2">
                <Server className="w-6 h-6 text-accent" />
                {t.admin.analytics.health.backendInfra}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-accent-bg border-2 border-border">
                  <span className="text-sm font-black uppercase tracking-widest">
                    {t.admin.analytics.health.database}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold opacity-60">
                      {health.components.database.latency_ms}ms
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black uppercase border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${health.components.database.status === "up" ? "bg-accent text-white" : "bg-error text-white"}`}
                    >
                      {health.components.database.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-bg border-4 border-border p-8 shadow-shadow space-y-6">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-text-header flex items-center gap-2">
                <Activity className="w-6 h-6 text-accent" />
                {t.admin.analytics.health.systemResources}
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span>{t.admin.analytics.health.memoryUsage}</span>
                    <span className="font-mono">
                      {health.components.system.memory_usage_mb} MB
                    </span>
                  </div>
                  <div className="h-4 bg-accent-bg border-2 border-border">
                    <div
                      className="h-full bg-accent border-r-2 border-border"
                      style={{
                        width: `${Math.min(100, (health.components.system.memory_usage_mb / 1024) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span>{t.admin.analytics.health.diskUsage}</span>
                    <span className="font-mono">
                      {health.components.system.disk_usage_percent}%
                    </span>
                  </div>
                  <div className="h-4 bg-accent-bg border-2 border-border">
                    <div
                      className="h-full bg-accent border-r-2 border-border"
                      style={{
                        width: `${health.components.system.disk_usage_percent}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
    <div className="text-4xl font-black italic tracking-tighter text-text-header tabular-nums">
      {value}
    </div>
  </div>
);

export default AnalyticsManager;
