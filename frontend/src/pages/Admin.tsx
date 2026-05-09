import React, { useState, useEffect } from "react";
import { fetchCMS, updateCMS } from "../../lib/api";
import type { ChatbotResponse, BlogPost } from "../types/cms";
import {
  MessageSquare,
  BookOpen,
  FileText,
  LogOut,
  Plus,
  Save,
  Edit2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type Tab = "chatbot" | "blog" | "pages";

const Admin: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("chatbot");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Data states
  const [chatbotData, setChatbotData] = useState<ChatbotResponse[]>([]);
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const [editingItem, setEditingItem] = useState<ChatbotResponse | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchCMS<ChatbotResponse[]>("/cms/chatbot", password)
      .then((data) => {
        setChatbotData(data);
        setIsAuthenticated(true);
        setError("");
        toast.success("Welcome back, Admin!");
      })
      .catch((err) => {
        setError("Invalid password or server error");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const loadTabContent = React.useCallback(() => {
    if (!isAuthenticated) return;

    // Use a small delay or just rely on the async nature of fetch to avoid synchronous setState during effect
    setLoading(true);

    if (activeTab === "chatbot") {
      fetchCMS<ChatbotResponse[]>("/cms/chatbot", password)
        .then(setChatbotData)
        .catch(() => toast.error("Failed to load chatbot data"))
        .finally(() => setLoading(false));
    } else if (activeTab === "blog") {
      fetchCMS<BlogPost[]>("/cms/blog", password)
        .then(setBlogData)
        .catch(() => toast.error("Failed to load blog data"))
        .finally(() => setLoading(false));
    }
  }, [activeTab, isAuthenticated, password]);

  useEffect(() => {
    // Calling loadTabContent inside a timeout or Promise.resolve().then()
    // to ensure it's not synchronous within the effect's execution if the linter is picky
    const timer = setTimeout(() => {
      loadTabContent();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadTabContent]);

  const handleSaveChatbot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setLoading(true);
      await updateCMS("/cms/chatbot", editingItem, password);
      toast.success("Chatbot response saved!");
      setEditingItem(null);
      loadTabContent();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save response");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      setLoading(true);
      await updateCMS("/cms/blog", editingPost, password);
      toast.success("Blog post saved!");
      setEditingPost(null);
      loadTabContent();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save post");
    } finally {
      setLoading(false);
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
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm px-1">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-white rounded-2xl font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-accent/20 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-fade-in bg-bg overflow-hidden">
      <header className="p-6 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-header tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs text-text opacity-60 font-medium uppercase tracking-widest mt-1">
            CMS v0.1.5 • Connected
          </p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="p-2.5 text-text hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-border p-4 space-y-2 hidden md:block shrink-0 bg-sidebar-bg/10">
          <button
            onClick={() => setActiveTab("chatbot")}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all ${
              activeTab === "chatbot"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-text hover:bg-white/5"
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5 mr-3" />
            <span className="font-bold text-sm">Chatbot</span>
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all ${
              activeTab === "blog"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-text hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4.5 h-4.5 mr-3" />
            <span className="font-bold text-sm">Blog Posts</span>
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all ${
              activeTab === "pages"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-text hover:bg-white/5"
            }`}
          >
            <FileText className="w-4.5 h-4.5 mr-3" />
            <span className="font-bold text-sm">Page Content</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {loading && !chatbotData.length && !blogData.length ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {activeTab === "chatbot" && (
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">Chatbot Responses</h2>
                    <button
                      onClick={() =>
                        setEditingItem({
                          module: "new",
                          triggers: [],
                          answers_en: [],
                          answers_es: [],
                          answers_fr: [],
                        })
                      }
                      className="flex items-center px-4 py-2 bg-success text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-md"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Response
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {chatbotData.map((resp) => (
                      <div
                        key={resp.id}
                        className="p-5 bg-white/5 border border-border rounded-3xl hover:border-accent/40 transition-all group flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider rounded border border-accent/20">
                              {resp.module}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-text-header mb-2 line-clamp-1">
                            {resp.triggers.join(", ")}
                          </p>
                          <p className="text-xs text-text opacity-70 line-clamp-2 italic">
                            {resp.answers_en[0]}
                          </p>
                        </div>
                        <button
                          onClick={() => setEditingItem(resp)}
                          className="p-2 text-text opacity-0 group-hover:opacity-100 hover:text-accent transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "blog" && (
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">Blog Posts</h2>
                    <button
                      onClick={() =>
                        setEditingPost({
                          slug: "",
                          date: new Date().toISOString().split("T")[0],
                          category: "Technical",
                          title_en: "",
                          title_es: "",
                          title_fr: "",
                          excerpt_en: "",
                          excerpt_es: "",
                          excerpt_fr: "",
                          content_en: "",
                          content_es: "",
                          content_fr: "",
                        })
                      }
                      className="flex items-center px-4 py-2 bg-success text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-md"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blogData.map((post) => (
                      <div
                        key={post.id}
                        className="p-6 bg-white/5 border border-border rounded-3xl hover:border-accent/40 transition-all group relative"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider rounded border border-accent/20">
                            {post.category}
                          </span>
                          <span className="text-[10px] text-text opacity-60">
                            {post.date}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-text-header mb-2 line-clamp-2 pr-8">
                          {post.title_en}
                        </h3>
                        <p className="text-xs text-text opacity-70 line-clamp-3">
                          {post.excerpt_en}
                        </p>
                        <button
                          onClick={() => setEditingPost(post)}
                          className="absolute top-6 right-6 p-2 text-text opacity-0 group-hover:opacity-100 hover:text-accent transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "pages" && (
                <div className="flex items-center justify-center h-64 text-text opacity-50 italic">
                  Page content management coming soon...
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Chatbot Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-sidebar-bg border border-border rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <header className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editingItem.id ? "Edit Response" : "New Response"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-text hover:text-text-header"
              >
                Cancel
              </button>
            </header>
            <form
              onSubmit={handleSaveChatbot}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Module"
                  value={editingItem.module}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, module: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl"
                  required
                />
                <input
                  placeholder="Category"
                  value={editingItem.category || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl"
                />
              </div>
              <textarea
                placeholder="Triggers (comma separated)"
                value={editingItem.triggers.join(", ")}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    triggers: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-20"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <textarea
                  placeholder="Answers (EN) - one per line"
                  value={editingItem.answers_en.join("\n")}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      answers_en: e.target.value.split("\n"),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-40 text-sm"
                  required
                />
                <textarea
                  placeholder="Answers (ES)"
                  value={editingItem.answers_es.join("\n")}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      answers_es: e.target.value.split("\n"),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-40 text-sm"
                  required
                />
                <textarea
                  placeholder="Answers (FR)"
                  value={editingItem.answers_fr.join("\n")}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      answers_fr: e.target.value.split("\n"),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-40 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" /> Save Response
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Blog Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-sidebar-bg border border-border rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">
            <header className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editingPost.id ? "Edit Post" : "New Post"}
              </h3>
              <button
                onClick={() => setEditingPost(null)}
                className="text-text hover:text-text-header"
              >
                Cancel
              </button>
            </header>
            <form
              onSubmit={handleSavePost}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  placeholder="Slug"
                  value={editingPost.slug}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, slug: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl"
                  required
                />
                <input
                  type="date"
                  value={editingPost.date}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, date: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl"
                  required
                />
                <input
                  placeholder="Category"
                  value={editingPost.category}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl"
                  required
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-accent">Titles & Excerpts</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <input
                      placeholder="Title (EN)"
                      value={editingPost.title_en}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          title_en: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl"
                      required
                    />
                    <textarea
                      placeholder="Excerpt (EN)"
                      value={editingPost.excerpt_en}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          excerpt_en: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-20 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      placeholder="Title (ES)"
                      value={editingPost.title_es}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          title_es: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl"
                      required
                    />
                    <textarea
                      placeholder="Excerpt (ES)"
                      value={editingPost.excerpt_es}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          excerpt_es: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-20 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      placeholder="Title (FR)"
                      value={editingPost.title_fr}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          title_fr: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl"
                      required
                    />
                    <textarea
                      placeholder="Excerpt (FR)"
                      value={editingPost.excerpt_fr}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          excerpt_fr: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-20 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-accent">Markdown Content</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <textarea
                    placeholder="Content (EN)"
                    value={editingPost.content_en}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        content_en: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-80 text-xs font-mono"
                    required
                  />
                  <textarea
                    placeholder="Content (ES)"
                    value={editingPost.content_es}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        content_es: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-80 text-xs font-mono"
                    required
                  />
                  <textarea
                    placeholder="Content (FR)"
                    value={editingPost.content_fr}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        content_fr: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-border rounded-xl h-80 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center sticky bottom-0"
              >
                <Save className="w-5 h-5 mr-2" /> Save Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
