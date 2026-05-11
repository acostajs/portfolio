import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  User,
  Briefcase,
  Code,
  Newspaper,
  Mail,
  Link as LinkIcon,
  FileText,
  Moon,
  Sun,
  Globe,
  Command,
} from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import { useTheme } from "../../../lib/context/ThemeContextUtils";
import { hapticFeedback } from "../../../lib/haptic";

interface CommandItem {
  id: string;
  name: string;
  section: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t, setLocale } = useTranslation();
  const { setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
    setSearch("");
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleOpen();
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "home",
      name: t.nav.home,
      section: "Navigation",
      icon: Home,
      action: () => navigate("/"),
    },
    {
      id: "about",
      name: t.nav.about,
      section: "Navigation",
      icon: User,
      action: () => navigate("/about"),
    },
    {
      id: "experience",
      name: t.nav.experience,
      section: "Navigation",
      icon: Briefcase,
      action: () => navigate("/experience"),
    },
    {
      id: "projects",
      name: t.nav.projects,
      section: "Navigation",
      icon: Code,
      action: () => navigate("/projects"),
    },
    {
      id: "blog",
      name: t.nav.blog,
      section: "Navigation",
      icon: Newspaper,
      action: () => navigate("/blog"),
    },
    {
      id: "contact",
      name: t.nav.contact,
      section: "Navigation",
      icon: Mail,
      action: () => navigate("/contact"),
    },
    // External
    {
      id: "github",
      name: "GitHub",
      section: "External",
      icon: LinkIcon,
      action: () =>
        window.open(`https://github.com/${t.common.github}`, "_blank"),
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      section: "External",
      icon: LinkIcon,
      action: () =>
        window.open(`https://linkedin.com/in/${t.common.linkedin}`, "_blank"),
    },
    {
      id: "resume",
      name: t.common.downloadResume,
      section: "External",
      icon: FileText,
      action: () => {
        const link = document.createElement("a");
        link.href = t.common.resumePath;
        link.download = "Juan_Acosta_CV.pdf";
        link.click();
      },
    },
    // Settings
    {
      id: "theme",
      name:
        resolvedTheme === "dark"
          ? "Switch to Light Mode"
          : "Switch to Dark Mode",
      section: "Settings",
      icon: resolvedTheme === "dark" ? Sun : Moon,
      action: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
    {
      id: "lang-en",
      name: "Switch to English",
      section: "Settings",
      icon: Globe,
      action: () => setLocale("en"),
    },
    {
      id: "lang-fr",
      name: "Switch to French",
      section: "Settings",
      icon: Globe,
      action: () => setLocale("fr"),
    },
    {
      id: "lang-es",
      name: "Switch to Spanish",
      section: "Settings",
      icon: Globe,
      action: () => setLocale("es"),
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.section.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (cmd: CommandItem) => {
    hapticFeedback(15);
    cmd.action();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      hapticFeedback(5);
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      hapticFeedback(5);
      setSelectedIndex(
        (prev) =>
          (prev - 1 + filteredCommands.length) % filteredCommands.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    }
  };

  // Group commands by section
  const sections = Array.from(new Set(filteredCommands.map((c) => c.section)));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:pt-40">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-xl bg-sidebar-bg backdrop-blur-2xl border border-border rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[60vh]"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-border bg-white/5">
              <Search className="w-5 h-5 text-text opacity-50 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-text-header placeholder:text-text/40 text-lg"
              />
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-white/10 border border-border rounded text-[10px] font-mono text-text-muted">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
              {filteredCommands.length > 0 ? (
                sections.map((section) => (
                  <div key={section}>
                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      {section}
                    </div>
                    {filteredCommands
                      .filter((c) => c.section === section)
                      .map((cmd) => {
                        const globalIndex = filteredCommands.indexOf(cmd);
                        const isSelected = globalIndex === selectedIndex;
                        return (
                          <button
                            key={cmd.id}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            onClick={() => handleSelect(cmd)}
                            className={`w-full flex items-center px-4 py-3 transition-colors ${
                              isSelected
                                ? "bg-accent text-white"
                                : "text-text hover:bg-white/5"
                            }`}
                          >
                            <cmd.icon
                              className={`w-4 h-4 mr-4 ${isSelected ? "text-white" : "opacity-60"}`}
                            />
                            <span className="flex-1 text-left font-medium">
                              {cmd.name}
                            </span>
                            {cmd.shortcut && (
                              <span
                                className={`text-[10px] font-mono ${isSelected ? "text-white/70" : "text-text/40"}`}
                              >
                                {cmd.shortcut}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                ))
              ) : (
                <div className="px-4 py-12 text-center">
                  <p className="text-text opacity-50">
                    No results found for "{search}"
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border bg-white/5 flex items-center justify-between text-[10px] text-text-muted font-medium">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-white/10 border border-border rounded mr-1.5 font-mono">
                    ↑↓
                  </kbd>
                  to navigate
                </span>
                <span className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-white/10 border border-border rounded mr-1.5 font-mono">
                    ENTER
                  </kbd>
                  to select
                </span>
              </div>
              <div className="flex items-center">
                <Command className="w-3 h-3 mr-1" />
                <span>K</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
