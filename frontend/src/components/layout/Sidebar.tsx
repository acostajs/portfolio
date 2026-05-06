import React from "react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import {
  Home,
  User,
  Briefcase,
  Code,
  Mail,
  MapPin,
  CircleDot,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const navLinks = [
    { name: t.nav.home, href: "#", icon: Home },
    { name: t.nav.about, href: "#", icon: User },
    { name: t.nav.experience, href: "#", icon: Briefcase },
    { name: t.nav.projects, href: "#", icon: Code },
    { name: t.nav.contact, href: "#", icon: Mail },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-bg border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-accent mb-4">
              <img
                src="/avatar.jpeg"
                alt={t.common.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-text-header">
              {t.common.name}
            </h2>
            <p className="text-sm text-text mt-1">{t.common.role}</p>
            <div className="flex items-center mt-2 text-xs text-text opacity-80">
              <MapPin className="w-3 h-3 mr-1" />
              {t.common.location}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center px-4 py-3 text-text hover:bg-accent-bg hover:text-accent rounded-lg transition-colors group"
                  >
                    <link.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Availability Status */}
          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-center p-3 bg-accent-bg/30 rounded-lg text-xs text-accent">
              <CircleDot className="w-3 h-3 mr-2 animate-pulse" />
              <span className="font-medium">{t.common.availability}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
