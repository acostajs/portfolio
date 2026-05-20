import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ChevronRight } from "lucide-react";
import { hapticFeedback } from "../../../lib/haptic";
import { useTranslation } from "../../../lib/hooks/useTranslation";

const PortfolioCLI: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    t.cli.welcome,
    t.cli.helpText,
  ]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        hapticFeedback(15);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(" ");
    const base = parts[0];
    const args = parts.slice(1);

    setHistory((prev) => [...prev, `> ${cmd}`]);

    switch (base) {
      case "help":
        setHistory((prev) => [
          ...prev,
          t.cli.commands.help,
          `  ls             - ${t.cli.commands.ls}`,
          `  cd <page>      - ${t.cli.commands.cd}`,
          `  whoami         - ${t.cli.commands.whoami}`,
          `  clear          - ${t.cli.commands.clear}`,
          `  exit           - ${t.cli.commands.exit}`,
          `  contact --send - ${t.cli.commands.contactSend}`,
        ]);
        break;
      case "ls":
        setHistory((prev) => [
          ...prev,
          "home, about, experience, projects, blog, contact",
        ]);
        break;
      case "cd":
        if (args.length === 0) {
          setHistory((prev) => [...prev, t.cli.commands.usageCd]);
        } else {
          const page = args[0];
          const validPages = [
            "home",
            "about",
            "experience",
            "projects",
            "blog",
            "contact",
          ];
          if (validPages.includes(page)) {
            setHistory((prev) => [
              ...prev,
              `${t.cli.commands.navigating} ${page}...`,
            ]);
            setTimeout(() => {
              navigate(page === "home" ? "/" : `/${page}`);
              setIsOpen(false);
            }, 500);
          } else {
            setHistory((prev) => [...prev, `Unknown page: ${page}`]);
          }
        }
        break;
      case "whoami":
        setHistory((prev) => [...prev, t.cli.whoamiText]);
        break;
      case "contact":
        if (args.includes("--send")) {
          setHistory((prev) => [...prev, t.cli.commands.redirecting]);
          setTimeout(() => {
            navigate("/contact");
            setIsOpen(false);
          }, 500);
        } else {
          setHistory((prev) => [...prev, t.cli.commands.usageContact]);
        }
        break;
      case "clear":
        setHistory([]);
        break;
      case "exit":
        setIsOpen(false);
        break;
      case "":
        break;
      default:
        setHistory((prev) => [...prev, `${t.cli.commands.unknown} ${base}`]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 pointer-events-none"
        >
          <div
            className="w-full max-w-4xl h-[60vh] bg-bg border-4 border-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pointer-events-auto overflow-hidden"
            role="dialog"
            aria-label={t.cli.title}
          >
            {/* Terminal Header */}
            <div className="bg-accent-bg border-b-4 border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-accent" />
                <span className="text-xs font-black uppercase tracking-widest text-text-header">
                  {t.cli.title} v0.2.5
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={t.cli.commands.exit}
                className="p-1 hover:bg-error hover:text-white transition-colors border-2 border-transparent hover:border-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal Content */}
            <div
              ref={scrollRef}
              className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar space-y-1 bg-black/5 dark:bg-black/20"
              aria-live="polite"
              aria-atomic="false"
            >
              {history.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith(">") ? "text-accent font-bold" : "text-text"
                  }
                >
                  {line}
                </div>
              ))}

              {/* Input Line */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 pt-2"
              >
                <ChevronRight className="w-4 h-4 text-accent animate-pulse" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-text-header font-bold"
                  autoFocus
                  aria-label={t.cli.prompt}
                />
              </form>
            </div>

            {/* Footer */}
            <div className="bg-accent-bg border-t-2 border-border/10 p-2 px-4 flex justify-between">
              <span className="text-[10px] font-bold text-text/40">
                {t.cli.prompt}
              </span>
              <span className="text-[10px] font-bold text-text/40 tracking-widest">
                UTF-8
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PortfolioCLI;
