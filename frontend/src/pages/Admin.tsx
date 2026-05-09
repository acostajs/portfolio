import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Lock,
  LayoutDashboard,
  User,
  Briefcase,
  FolderKanban,
  Newspaper,
  MessageSquare,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { hapticFeedback } from "../../lib/haptic";

type AdminTab = "about" | "experience" | "projects" | "blog" | "chatbot";

interface AboutData {
  id?: number;
  p1_en: string;
  p1_es: string;
  p1_fr: string;
  p2_en: string;
  p2_es: string;
  p2_fr: string;
  skills: string[];
}

interface ExperienceData {
  id?: number;
  company: string;
  role: string;
  period: string;
  description_en: string[];
  description_es?: string[];
  description_fr?: string[];
  tech: string[];
  order: number;
}

interface ProjectData {
  id?: number;
  title: string;
  description_en: string;
  description_es?: string;
  description_fr?: string;
  tech: string[];
  link?: string;
  github?: string;
  image?: string;
  order: number;
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("admin-token") === "admin123";
  });
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("about");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback(10);
    if (password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin-token", "admin123");
      toast.success("Welcome, Admin");
    } else {
      toast.error("Invalid password");
    }
  };

  const handleLogout = () => {
    hapticFeedback(20);
    setIsAuthenticated(false);
    localStorage.removeItem("admin-token");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 border border-border p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-text-header">
              Admin Access
            </h1>
            <p className="text-text opacity-60 text-sm">
              Enter password to manage content
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/5 border border-border focus:border-accent rounded-xl outline-none text-text-header"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-accent/20"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-bg">
      {/* Admin Header */}
      <header className="flex-none p-4 md:p-6 border-b border-border bg-white/5 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-bold text-text-header">CMS Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text hover:text-error transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar */}
        <nav className="w-16 md:w-64 flex-none border-r border-border bg-white/5 flex flex-col py-4">
          <TabButton
            active={activeTab === "about"}
            onClick={() => setActiveTab("about")}
            icon={User}
            label="About"
          />
          <TabButton
            active={activeTab === "experience"}
            onClick={() => setActiveTab("experience")}
            icon={Briefcase}
            label="Experience"
          />
          <TabButton
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
            icon={FolderKanban}
            label="Projects"
          />
          <TabButton
            active={activeTab === "blog"}
            onClick={() => setActiveTab("blog")}
            icon={Newspaper}
            label="Blog"
          />
          <TabButton
            active={activeTab === "chatbot"}
            onClick={() => setActiveTab("chatbot")}
            icon={MessageSquare}
            label="Chatbot"
          />
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === "about" && <AboutManager />}
            {activeTab === "experience" && <ExperienceManager />}
            {activeTab === "projects" && <ProjectsManager />}
            {activeTab === "blog" && <BlogManager />}
            {activeTab === "chatbot" && <ChatbotManager />}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Sub-components ---

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={() => {
      hapticFeedback(5);
      onClick();
    }}
    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all ${
      active
        ? "bg-accent text-white shadow-lg shadow-accent/20"
        : "text-text hover:bg-white/5 hover:text-text-header"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="hidden md:block font-medium">{label}</span>
  </button>
);

// --- Content Managers ---

const AboutManager: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAbout = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/about", {
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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
    return <div className="animate-pulse text-text">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-header">
          Manage About Content
        </h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
        >
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EN */}
        <div className="space-y-4 bg-white/5 border border-border p-6 rounded-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">
            English
          </h3>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">Paragraph 1</label>
            <textarea
              value={data?.p1_en || ""}
              onChange={(e) =>
                data && setData({ ...data, p1_en: e.target.value })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">Paragraph 2</label>
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
            Spanish
          </h3>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">Paragraph 1</label>
            <textarea
              value={data?.p1_es || ""}
              onChange={(e) =>
                data && setData({ ...data, p1_es: e.target.value })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">Paragraph 2</label>
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
            French
          </h3>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">Paragraph 1</label>
            <textarea
              value={data?.p1_fr || ""}
              onChange={(e) =>
                data && setData({ ...data, p1_fr: e.target.value })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-lg text-sm text-text-header min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text opacity-50">Paragraph 2</label>
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
            Skills (Comma separated)
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

const ExperienceManager: React.FC = () => {
  const [items, setItems] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ExperienceData | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/experience", {
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
        },
      });
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
      ? "/api/v1/admin/experience"
      : `/api/v1/admin/experience/${editingItem.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
        },
        body: JSON.stringify(editingItem),
      });
      if (response.ok) {
        toast.success(isNew ? "Experience added" : "Experience updated");
        setEditingItem(null);
        void fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    hapticFeedback(20);
    try {
      const response = await fetch(`/api/v1/admin/experience/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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

  if (isLoading) return <div className="text-text">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-header">
          Manage Experience
        </h2>
        <button
          onClick={() =>
            setEditingItem({
              company: "",
              role: "",
              period: "",
              description_en: [],
              tech: [],
              order: items.length,
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {editingItem ? (
        <form
          onSubmit={handleSave}
          className="bg-white/5 border border-accent/30 p-8 rounded-3xl space-y-6 relative animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                Company
              </label>
              <input
                required
                value={editingItem.company}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, company: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                Role
              </label>
              <input
                required
                value={editingItem.role}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, role: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                Period
              </label>
              <input
                required
                value={editingItem.period}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, period: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
                placeholder="2023 - Present"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                Order
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
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              Description (EN, one per line)
            </label>
            <textarea
              value={editingItem.description_en.join("\n")}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  description_en: e.target.value.split("\n").filter((l) => l),
                })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              Tech Stack (comma separated)
            </label>
            <input
              value={editingItem.tech.join(", ")}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  tech: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s),
                })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-accent/20"
            >
              {editingItem.id ? "Update Experience" : "Add Experience"}
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-6 py-3 bg-white/5 border border-border text-text rounded-xl font-bold hover:bg-white/10"
            >
              Cancel
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
                <h3 className="font-bold text-text-header text-lg">
                  {item.role}
                </h3>
                <p className="text-accent text-sm font-medium">
                  {item.company}
                </p>
                <p className="text-text opacity-50 text-xs mt-1">
                  {item.period}
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

const ProjectsManager: React.FC = () => {
  const [items, setItems] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ProjectData | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/projects", {
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
        },
      });
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
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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
    if (!confirm("Are you sure?")) return;
    hapticFeedback(20);
    try {
      const response = await fetch(`/api/v1/admin/projects/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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
            "X-Admin-Password": localStorage.getItem("admin-token") || "",
          },
          body: formData,
        }
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

  if (isLoading) return <div className="text-text">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-header">Manage Projects</h2>
        <button
          onClick={() =>
            setEditingItem({
              title: "",
              description_en: "",
              tech: [],
              order: items.length,
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New
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
                Title
              </label>
              <input
                required
                value={editingItem.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                Order
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
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              Project Image
            </label>
            <div className="flex items-center gap-6 p-4 bg-white/5 border border-border rounded-2xl">
              <div className="w-32 h-20 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center border border-border">
                {editingItem.image ? (
                  <img
                    src={editingItem.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-text opacity-20" />
                )}
              </div>
              <div className="flex-1 space-y-2">
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
                      toast.info("Save the project first to upload an image");
                    }
                  }}
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-text-header text-sm font-bold rounded-xl cursor-pointer transition-all w-fit"
                >
                  <Upload className="w-4 h-4" />
                  {editingItem.image ? "Change Image" : "Upload Image"}
                </label>
                <p className="text-[10px] text-text opacity-40">
                  Recommended: 1200x800px. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                GitHub URL
              </label>
              <input
                value={editingItem.github || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, github: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                Live Link
              </label>
              <input
                value={editingItem.link || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, link: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              Description (EN)
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
              className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
              Tech Stack (comma separated)
            </label>
            <input
              value={editingItem.tech.join(", ")}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  tech: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s),
                })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-accent/20"
            >
              {editingItem.id ? "Update Project" : "Add Project"}
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-6 py-3 bg-white/5 border border-border text-text rounded-xl font-bold hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white/5 border border-border rounded-2xl group hover:border-accent/30 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-text-header text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-text opacity-60 text-sm line-clamp-2">
                  {item.description_en}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
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

interface BlogData {
  id?: number;
  slug: string;
  date: string;
  category: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  excerpt_en: string;
  excerpt_es: string;
  excerpt_fr: string;
  content_en: string;
  content_es: string;
  content_fr: string;
  published: boolean;
}

const BlogManager: React.FC = () => {
  const [items, setItems] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<BlogData | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/blog", {
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
        },
      });
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
      ? "/api/v1/admin/blog"
      : `/api/v1/admin/blog/${editingItem.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
        },
        body: JSON.stringify(editingItem),
      });
      if (response.ok) {
        toast.success(isNew ? "Post created" : "Post updated");
        setEditingItem(null);
        void fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete post?")) return;
    hapticFeedback(20);
    try {
      const response = await fetch(`/api/v1/admin/blog/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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

  if (isLoading) return <div className="text-text">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-header">
          Manage Blog Posts
        </h2>
        <button
          onClick={() =>
            setEditingItem({
              slug: "",
              date: new Date().toISOString().split("T")[0],
              category: "General",
              title_en: "",
              title_es: "",
              title_fr: "",
              excerpt_en: "",
              excerpt_es: "",
              excerpt_fr: "",
              content_en: "",
              content_es: "",
              content_fr: "",
              published: true,
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {editingItem ? (
        <form
          onSubmit={handleSave}
          className="bg-white/5 border border-accent/30 p-8 rounded-3xl space-y-8 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                Slug
              </label>
              <input
                required
                value={editingItem.slug}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, slug: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
                placeholder="my-post-slug"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                Date
              </label>
              <input
                type="date"
                required
                value={editingItem.date}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, date: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest">
                Category
              </label>
              <input
                required
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 border border-border rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-accent uppercase tracking-tighter">
                English Content
              </h3>
              <input
                required
                value={editingItem.title_en}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title_en: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header font-bold"
                placeholder="Title"
              />
              <textarea
                required
                value={editingItem.excerpt_en}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, excerpt_en: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text opacity-70 text-sm"
                placeholder="Excerpt (short summary)"
                rows={2}
              />
              <textarea
                required
                value={editingItem.content_en}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, content_en: e.target.value })
                }
                className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header text-sm font-mono"
                placeholder="Markdown content..."
                rows={10}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${editingItem.published ? "bg-accent" : "bg-white/10"}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${editingItem.published ? "translate-x-6" : ""}`}
                />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={editingItem.published}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    published: e.target.checked,
                  })
                }
              />
              <span className="text-sm font-medium text-text-header">
                Published
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-accent/20"
            >
              {editingItem.id ? "Update Post" : "Create Post"}
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-6 py-3 bg-white/5 border border-border text-text rounded-xl font-bold hover:bg-white/10"
            >
              Cancel
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
                    {item.title_en}
                  </h3>
                  {!item.published && (
                    <span className="px-2 py-0.5 bg-white/10 text-text opacity-50 text-[10px] uppercase font-bold rounded">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-accent text-xs font-medium">
                  {item.category} • {item.date}
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

interface ChatbotData {
  id?: number;
  module: string;
  category?: string;
  triggers: string[];
  answers_en: string[];
  answers_es: string[];
  answers_fr: string[];
}

const ChatbotManager: React.FC = () => {
  const [items, setItems] = useState<ChatbotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ChatbotData | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/admin/chat-triggers", {
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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
    if (!confirm("Delete trigger?")) return;
    hapticFeedback(20);
    try {
      const response = await fetch(`/api/v1/admin/chat-triggers/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Password": localStorage.getItem("admin-token") || "",
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

  if (isLoading) return <div className="text-text">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-header">
          Manage Chatbot Triggers
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
          <Plus className="w-4 h-4" /> New Trigger
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
                Module
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
                Category (Optional)
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
              Triggers (comma separated)
            </label>
            <textarea
              required
              value={editingItem.triggers.join(", ")}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  triggers: e.target.value
                    .split(",")
                    .map((s) => s.trim().toLowerCase())
                    .filter((s) => s),
                })
              }
              className="w-full p-3 bg-white/5 border border-border rounded-xl text-text-header min-h-[60px]"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-text opacity-50 uppercase font-bold tracking-widest text-accent">
                Answers (EN, one per line)
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
                Answers (ES, one per line)
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
                Answers (FR, one per line)
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
              {editingItem.id ? "Update Trigger" : "Create Trigger"}
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-6 py-3 bg-white/5 border border-border text-text rounded-xl font-bold hover:bg-white/10"
            >
              Cancel
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

export default Admin;
