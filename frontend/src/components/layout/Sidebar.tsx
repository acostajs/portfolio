import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Newspaper,
  Copy,
  Check,
} from "lucide-react";
import ProgressiveImage from "../chat/ProgressiveImage";
import { hapticFeedback } from "../../../lib/haptic";

export type PageId =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "blog"
  | "contact"
  | "admin";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: PageId;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activePage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const navLinks = [
    { id: "home" as PageId, name: t.nav.home, icon: Home, path: "/" },
    { id: "about" as PageId, name: t.nav.about, icon: User, path: "/about" },
    {
      id: "experience" as PageId,
      name: t.nav.experience,
      icon: Briefcase,
      path: "/experience",
    },
    {
      id: "projects" as PageId,
      name: t.nav.projects,
      icon: Code,
      path: "/projects",
    },
    { id: "blog" as PageId, name: t.nav.blog, icon: Newspaper, path: "/blog" },
    {
      id: "contact" as PageId,
      name: t.nav.contact,
      icon: Mail,
      path: "/contact",
    },
  ];

  const contactInfo = [
    { icon: MapPin, text: t.common.location },
    {
      icon: Mail,
      text: t.common.email,
      href: `mailto:${t.common.email}`,
      isEmail: true,
    },
    {
      icon: LinkIcon,
      text: t.common.linkedin,
      href: `https://linkedin.com/in/${t.common.linkedin}`,
    },
    {
      icon: LinkIcon,
      text: t.common.github,
      href: `https://github.com/${t.common.github}`,
    },
  ];

  const handleLinkClick = (path: string) => {
    hapticFeedback(10);
    navigate(path);
    onClose(); // Close sidebar on mobile after clicking
  };

  const copyToClipboard = (text: string) => {
    hapticFeedback(15);
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-bg backdrop-blur-xl border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          {/* Top Profile Section */}
          <div className="p-5 flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
                <ProgressiveImage
                  src="/avatar.jpeg"
                  alt={t.common.name}
                  className="w-full h-full grayscale brightness-110"
                />
              </div>
            </div>

            <a
              href={t.common.resumePath}
              download
              className="flex items-center justify-center w-full py-2 px-4 bg-success text-white rounded-full font-bold text-xs hover:brightness-110 transition-all shadow-md mb-4 group"
            >
              <Download className="w-3.5 h-3.5 mr-2 group-hover:animate-bounce" />
              {t.common.downloadResume}
            </a>

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
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.path)}
                    className={`flex items-center w-full px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                      activePage === link.id
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "text-text hover:bg-white/5 hover:text-text-header"
                    }`}
                  >
                    <link.icon
                      className={`w-4.5 h-4.5 mr-3 transition-transform group-hover:scale-110 ${activePage === link.id ? "text-white" : "text-text opacity-70"}`}
                    />
                    <span className="font-semibold text-sm">{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-6 mb-4">
            <div className="h-px bg-border w-full opacity-50" />
          </div>

          {/* Bottom Contact Section */}
          <div className="px-6 space-y-3 mb-6">
            {contactInfo.map((info, idx) => {
              const isEmail = "isEmail" in info && info.isEmail;

              const Content = (
                <>
                  <info.icon className="w-3.5 h-3.5 mr-3 opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all shrink-0" />
                  <span className="truncate">{info.text}</span>
                </>
              );

              return (
                <div key={idx} className="flex items-center group">
                  {info.href ? (
                    <a
                      href={info.href}
                      target={
                        info.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        info.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-center text-[13px] text-text hover:text-text-header transition-colors flex-1 truncate"
                    >
                      {Content}
                    </a>
                  ) : (
                    <div className="flex items-center text-[13px] text-text cursor-default flex-1 truncate">
                      {Content}
                    </div>
                  )}

                  {isEmail && (
                    <button
                      onClick={() => copyToClipboard(info.text)}
                      className={`ml-2 p-1.5 rounded-md transition-all ${
                        copiedEmail
                          ? "text-success bg-success/10"
                          : "text-text opacity-0 group-hover:opacity-100 hover:bg-white/5"
                      }`}
                      aria-label="Copy email"
                      title="Copy email"
                    >
                      {copiedEmail ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
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
