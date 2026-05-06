import React from "react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import { useTheme } from "../../../lib/context/ThemeContextUtils";
import { Menu, Moon, Sun } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t, locale, setLocale } = useTranslation();
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 h-16 bg-[var(--header-bg)] backdrop-blur-md border-b border-border px-4 lg:px-8 w-full">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        {/* Left Section: Mobile Menu Toggle & Logo */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 mr-2 text-text hover:bg-accent-bg rounded-lg lg:hidden"
            aria-label={t.header.toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent mr-3">
              <img
                src="/avatar.jpeg"
                alt={t.common.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-text-header leading-tight">
                {t.header.title}
              </h1>
              <p className="text-xs text-text opacity-70">
                {t.header.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Toggles */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-white/5 border border-border rounded-lg p-0.5">
            {(["en", "fr", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                  locale === l
                    ? "bg-accent text-white shadow-lg"
                    : "text-text hover:text-text-header"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle - Sized to match language buttons */}
          <div className="flex items-center bg-white/5 border border-border rounded-lg p-0.5">
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="px-2 py-1 rounded-md text-[10px] font-bold transition-all text-text hover:text-text-header"
              aria-label={t.header.toggleTheme}
            >
              {resolvedTheme === "dark" ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
