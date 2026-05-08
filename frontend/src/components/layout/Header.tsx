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
    <header className="flex-none sticky top-0 z-40 bg-[var(--header-bg)] backdrop-blur-md border-b border-border px-4 lg:px-8 w-full pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        {/* Left Section: Mobile Menu Toggle & Logo */}
        <div className="flex items-center min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 mr-2 text-text hover:bg-accent-bg rounded-lg lg:hidden flex-none"
            aria-label={t.header.toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent mr-3 flex-none">
              <img
                src="/avatar.jpeg"
                alt={t.common.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[clamp(0.875rem,4vw,1rem)] font-bold text-text-header leading-tight truncate">
                {t.header.title}
              </h1>
              <p className="text-[10px] text-text opacity-70 truncate">
                {t.header.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Toggles */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-none ml-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-white/5 border border-border rounded-lg p-0.5">
            {(["en", "fr", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold transition-all ${
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
              className="px-1.5 py-1 sm:px-2 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold transition-all text-text hover:text-text-header"
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
