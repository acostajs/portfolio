import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import { useTheme } from "../../../lib/context/ThemeContextUtils";
import { Menu, Moon, Sun } from "lucide-react";
import ProgressiveImage from "../chat/ProgressiveImage";
import { hapticFeedback } from "../../../lib/haptic";

interface HeaderProps {
  onMenuClick: () => void;
  hideMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  hideMenuButton = false,
}) => {
  const { t, locale, setLocale } = useTranslation();
  const { setTheme, resolvedTheme } = useTheme();

  const handleLanguageChange = (l: "en" | "fr" | "es") => {
    hapticFeedback(5);
    setLocale(l);
  };

  const handleThemeToggle = () => {
    hapticFeedback(10);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex-none sticky top-0 z-40 bg-[var(--header-bg)] border-b-4 border-border px-4 lg:px-8 w-full pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between h-24 max-w-7xl mx-auto">
        {/* Left Section: Mobile Menu Toggle & Logo */}
        <div className="flex items-center min-w-0">
          {!hideMenuButton && (
            <button
              onClick={() => {
                hapticFeedback(10);
                onMenuClick();
              }}
              className="p-2 mr-2 text-text border-2 border-transparent hover:border-accent hover:bg-accent-bg rounded-none lg:hidden flex-none transition-all"
              aria-label={t.header.toggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <Link
            to="/"
            onClick={() => hapticFeedback(15)}
            className="flex items-center min-w-0 group hover:opacity-80 transition-opacity"
            aria-label={t.nav.home}
          >
            <div className="w-12 h-12 rounded-none overflow-hidden border-2 border-accent mr-3 flex-none group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-all shadow-shadow">
              <ProgressiveImage
                src="/avatar.jpeg"
                alt={t.common.name}
                className="w-full h-full"
              />
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <h1 className="text-[clamp(1.125rem,6vw,1.5rem)] font-black text-text-header leading-tight truncate uppercase tracking-tighter">
                {t.header.title}
              </h1>
              <p className="text-xs text-text-muted truncate font-mono uppercase font-bold">
                {t.header.subtitle}
              </p>
            </div>
          </Link>
        </div>

        {/* Right Section: Toggles */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-none ml-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-accent-bg border-2 border-border rounded-none p-0.5">
            {(["en", "fr", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                aria-label={t.header.switchLanguage.replace(
                  "{lang}",
                  l === "en" ? "English" : l === "fr" ? "French" : "Spanish",
                )}
                className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-none text-[10px] sm:text-[11px] font-black transition-all border-2 ${
                  locale === l
                    ? "bg-accent text-white border-accent shadow-shadow -translate-y-0.5 -translate-x-0.5"
                    : "text-text border-transparent hover:text-text-header hover:border-accent/30"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle - Sized to match language buttons */}
          <div className="flex items-center bg-accent-bg border-2 border-border rounded-none p-0.5">
            <button
              onClick={handleThemeToggle}
              className="px-1.5 py-1 sm:px-2 sm:py-1 rounded-none text-[10px] sm:text-[11px] font-black transition-all text-text border-2 border-transparent hover:text-text-header hover:border-accent/30"
              aria-label={t.header.toggleTheme}
            >
              {resolvedTheme === "dark" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
