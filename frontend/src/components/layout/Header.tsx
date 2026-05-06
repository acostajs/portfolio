import React from "react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import { useTheme } from "../../../lib/context/ThemeContext";
import { Menu, Moon, Sun, Languages } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t, locale, setLocale } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-bg/80 backdrop-blur-md border-b border-border px-4 lg:px-8">
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

          <div className="flex items-center lg:hidden">
            <img
              src="/avatar.jpeg"
              alt={t.common.name}
              className="w-8 h-8 rounded-full mr-2 border border-accent"
            />
            <span className="font-bold text-text-header hidden sm:inline">
              {t.common.name}
            </span>
          </div>
        </div>

        {/* Right Section: Toggles */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-accent-bg/30 rounded-lg p-1">
            <Languages className="w-4 h-4 text-accent mx-2 hidden sm:block" />
            {(["en", "fr", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  locale === l
                    ? "bg-accent text-white shadow-sm"
                    : "text-text hover:text-accent"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-text hover:bg-accent-bg rounded-lg transition-colors"
            aria-label={t.header.toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-accent" />
            ) : (
              <Moon className="w-5 h-5 text-accent" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
