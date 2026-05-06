import React from "react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import {
  Home,
  User,
  Briefcase,
  Code,
  Mail,
  MapPin,
  Download,
  Link as LinkIcon,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const navLinks = [
    { name: t.nav.home, href: "#", icon: Home, active: true },
    { name: t.nav.about, href: "#", icon: User },
    { name: t.nav.experience, href: "#", icon: Briefcase },
    { name: t.nav.projects, href: "#", icon: Code },
    { name: t.nav.contact, href: "#", icon: Mail },
  ];

  const contactInfo = [
    { icon: MapPin, text: t.common.location },
    { icon: Mail, text: t.common.email },
    { icon: LinkIcon, text: t.common.linkedin },
    { icon: LinkIcon, text: t.common.github },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 z-50 lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-bg border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          {/* Top Profile Section */}
          <div className="p-5 flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
                <img
                  src="/avatar.jpeg"
                  alt={t.common.name}
                  className="w-full h-full object-cover grayscale brightness-110"
                />
              </div>
            </div>

            <button className="flex items-center justify-center w-full py-2 px-4 bg-success text-white rounded-full font-bold text-xs hover:brightness-110 transition-all shadow-md mb-4 group">
              <Download className="w-3.5 h-3.5 mr-2 group-hover:animate-bounce" />
              {t.common.downloadResume}
            </button>

            <div className="text-center">
              <h2 className="text-xl font-bold text-text-header tracking-tight">
                {t.common.name}
              </h2>
              <p className="text-[13px] text-text mt-1 leading-snug opacity-80 max-w-[180px] mx-auto">
                {t.common.role}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 mb-4">
            <ul className="space-y-0.5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                      link.active
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "text-text hover:bg-white/5 hover:text-text-header"
                    }`}
                  >
                    <link.icon
                      className={`w-4.5 h-4.5 mr-3 transition-transform group-hover:scale-110 ${link.active ? "text-white" : "text-text opacity-70"}`}
                    />
                    <span className="font-semibold text-sm">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-6 mb-4">
            <div className="h-px bg-border w-full opacity-50" />
          </div>

          {/* Bottom Contact Section */}
          <div className="px-6 space-y-3 mb-6">
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="flex items-center text-[13px] text-text hover:text-text-header transition-colors group cursor-default"
              >
                <info.icon className="w-3.5 h-3.5 mr-3 opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all" />
                <span className="truncate">{info.text}</span>
              </div>
            ))}
          </div>

          {/* Availability Status */}
          <div className="px-5 pb-6 mt-auto">
            <p className="text-[9px] font-bold uppercase tracking-widest text-text opacity-50 mb-2 ml-1">
              {t.common.availabilityTitle}
            </p>
            <div className="p-3 bg-white/5 border border-border rounded-xl text-[11px] text-text-header leading-tight">
              {t.common.availability}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
