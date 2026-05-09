import React, { useState } from "react";

const Admin: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple dummy password for foundation
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <form
          onSubmit={handleLogin}
          className="p-8 bg-sidebar-bg/40 backdrop-blur-md border border-border rounded-3xl shadow-2xl w-full max-w-md animate-slide-up"
        >
          <h1 className="text-2xl font-bold mb-6 text-text-header">
            Admin Access
          </h1>
          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-5 py-3 bg-white/5 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-text-header placeholder:opacity-50"
              />
            </div>
            {error && <p className="text-red-500 text-sm px-1">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-accent text-white rounded-2xl font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-text-header mb-2">
          Admin Dashboard
        </h1>
        <p className="text-text opacity-70">CMS Foundation - Version 0.1.5</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 border border-border rounded-3xl">
          <h2 className="text-xl font-bold mb-3">Content Management</h2>
          <p className="text-sm text-text opacity-80 mb-4">
            Manage your pages, experience, and projects.
          </p>
          <div className="flex items-center text-xs font-bold text-accent uppercase tracking-widest">
            Coming Soon
          </div>
        </div>

        <div className="p-6 bg-white/5 border border-border rounded-3xl">
          <h2 className="text-xl font-bold mb-3">Chatbot Intelligence</h2>
          <p className="text-sm text-text opacity-80 mb-4">
            Refine triggers and assistant responses.
          </p>
          <div className="flex items-center text-xs font-bold text-accent uppercase tracking-widest">
            Coming Soon
          </div>
        </div>

        <div className="p-6 bg-white/5 border border-border rounded-3xl">
          <h2 className="text-xl font-bold mb-3">Blog Posts</h2>
          <p className="text-sm text-text opacity-80 mb-4">
            Write and publish technical articles.
          </p>
          <div className="flex items-center text-xs font-bold text-accent uppercase tracking-widest">
            Coming Soon
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;
