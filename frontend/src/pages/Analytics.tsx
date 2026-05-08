import React, { useState, useEffect } from "react";
import {
  BarChart2,
  Users,
  MessageSquare,
  Lock,
  Globe,
  MousePointer2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Terminal,
  RefreshCcw,
} from "lucide-react";

interface Stats {
  total_visitors: number;
  total_messages: number;
  top_pages: { path: string; count: number }[];
  top_queries: { query: string; count: number }[];
}

interface TelemetryRecord {
  id: number;
  ip: string;
  user_agent: string;
  path: string;
  method: string;
  timestamp: string;
}

const Analytics: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const verifyAndFetch = async (pass: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/v1/analytics/stats", {
        headers: {
          "X-Analytics-Password": pass,
        },
      });

      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);

        const telemetryResponse = await fetch(
          "/api/v1/analytics/telemetry?limit=50",
          {
            headers: {
              "X-Analytics-Password": pass,
            },
          },
        );
        const telemetryData = await telemetryResponse.json();
        setTelemetry(telemetryData);

        setIsAuthenticated(true);
        localStorage.setItem("analytics_password", pass);
      } else {
        setError("Invalid password or server error");
        localStorage.removeItem("analytics_password");
      }
    } catch {
      setError("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem("analytics_password");
    if (savedPassword) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      verifyAndFetch(savedPassword);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAndFetch(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem("analytics_password");
  };

  if (!isAuthenticated) {
    return (
      <section className="flex-1 flex items-center justify-center p-6 bg-bg">
        <div className="w-full max-w-md bg-white/5 border border-border rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 border border-accent/20">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-text-header">
              Analytics Access
            </h1>
            <p className="text-text opacity-60 text-sm mt-2">
              Enter your password to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-border rounded-xl outline-none focus:border-accent transition-colors text-text-header placeholder:text-text/30"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center text-error text-xs font-bold uppercase tracking-wider bg-error/10 p-3 rounded-lg border border-error/20">
                <AlertCircle className="w-3.5 h-3.5 mr-2" />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-bg">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-success">
                Secure Access
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-header flex items-center gap-3">
              <BarChart2 className="w-8 h-8 text-accent" />
              Analytics Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                verifyAndFetch(localStorage.getItem("analytics_password") || "")
              }
              disabled={loading}
              className="p-3 bg-white/5 border border-border rounded-xl text-text hover:text-text-header transition-colors group"
              title="Refresh Data"
            >
              <RefreshCcw
                className={`w-5 h-5 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
              />
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-3 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-bold hover:bg-error/20 transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Visitors",
              value: stats?.total_visitors || 0,
              icon: Users,
              color: "text-blue-400",
            },
            {
              label: "Chat Messages",
              value: stats?.total_messages || 0,
              icon: MessageSquare,
              color: "text-purple-400",
            },
            {
              label: "Top Path",
              value: stats?.top_pages[0]?.path || "/",
              icon: Globe,
              color: "text-green-400",
            },
            {
              label: "Top Query",
              value: stats?.top_queries[0]?.query || "None",
              icon: Terminal,
              color: "text-yellow-400",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-border rounded-2xl p-6 shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2 rounded-lg bg-white/5 border border-border ${stat.color}`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-text-header mb-1 truncate">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-text opacity-50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <div className="bg-white/5 border border-border rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-bold text-text-header mb-6 flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-accent" />
              Popular Pages
            </h2>
            <div className="space-y-3">
              {stats?.top_pages.map((page, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-border transition-colors"
                >
                  <span className="text-sm font-mono text-text truncate max-w-[70%]">
                    {page.path}
                  </span>
                  <span className="text-xs font-bold bg-accent/10 text-accent px-2.5 py-1 rounded-full">
                    {page.count} views
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Queries */}
          <div className="bg-white/5 border border-border rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-bold text-text-header mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Common Queries
            </h2>
            <div className="space-y-3">
              {stats?.top_queries.map((query, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-border transition-colors"
                >
                  <span className="text-sm text-text truncate max-w-[70%] italic">
                    "{query.query}"
                  </span>
                  <span className="text-xs font-bold bg-purple-400/10 text-purple-400 px-2.5 py-1 rounded-full">
                    {query.count} times
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="bg-white/5 border border-border rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-header flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              Recent Visitor Activity
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text opacity-40">
              Showing last 50 events
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text opacity-50">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text opacity-50">
                    Method
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text opacity-50">
                    Path
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text opacity-50">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {telemetry.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-text opacity-70">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm ${
                          record.method === "GET"
                            ? "bg-blue-400/10 text-blue-400"
                            : "bg-green-400/10 text-green-400"
                        }`}
                      >
                        {record.method}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-xs font-mono text-text-header truncate max-w-[200px]"
                      title={record.path}
                    >
                      {record.path}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-text opacity-60">
                      {record.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
