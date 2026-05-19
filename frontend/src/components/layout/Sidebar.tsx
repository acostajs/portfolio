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
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-bg border-r-4 border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          {/* Top Profile Section - Matches Header Height (96px + 4px border = 100px) */}
          <div className="h-25 flex flex-col justify-center px-6 border-b-4 border-border shrink-0">
            <h2 className="text-2xl font-black text-text-header tracking-tighter uppercase leading-none">
              {t.common.name}
            </h2>
            <p className="text-[12px] text-accent mt-2 leading-tight font-mono font-bold uppercase">
              {t.common.role}
            </p>
          </div>

          {/* Action Section */}
          <div className="p-6 pb-2">
            <a
              href={t.common.resumePath}
              download
              className="flex items-center justify-center py-2.5 px-6 bg-transparent text-accent rounded-none border-4 border-accent font-black uppercase tracking-widest text-[10px] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all shadow-shadow mb-6 group"
            >
              <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              {t.common.downloadResume}
            </a>
          </div>

          {/* Navigation */}
          <nav className="px-3 mb-4">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.path)}
                    className={`flex items-center w-full px-4 py-2.5 rounded-none border-2 transition-all duration-200 group ${
                      activePage === link.id
                        ? "bg-accent text-white border-accent shadow-shadow -translate-y-1 -translate-x-1"
                        : "text-text border-transparent hover:bg-accent-bg hover:border-accent"
                    }`}
                  >
                    <link.icon
                      className={`w-4.5 h-4.5 mr-3 transition-transform group-hover:scale-110 ${activePage === link.id ? "text-white" : "text-text-muted"}`}
                    />
                    <span className="font-bold text-sm uppercase tracking-tight">
                      {link.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-6 mb-4">
            <div className="h-1 bg-border w-full" />
          </div>

          {/* Bottom Contact Section */}
          <div className="px-6 space-y-3 mb-6">
            {contactInfo.map((info, idx) => {
              const isEmail = "isEmail" in info && info.isEmail;

              const Content = (
                <>
                  <info.icon className="w-3.5 h-3.5 mr-3 text-text-muted group-hover:text-accent transition-all shrink-0" />
                  <span className="truncate font-mono text-[12px]">
                    {info.text}
                  </span>
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
                      className="flex items-center text-[13px] text-text hover:text-accent transition-colors flex-1 truncate"
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
                      className={`ml-2 p-1.5 rounded-none border border-transparent transition-all ${
                        copiedEmail
                          ? "text-success bg-success/10 border-success"
                          : "text-text opacity-0 group-hover:opacity-100 hover:bg-accent-bg hover:border-accent"
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
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 ml-1">
              {t.common.availabilityTitle}
            </p>
            <div className="p-3 bg-accent-bg border-2 border-accent rounded-none text-[11px] text-text-header leading-tight font-bold shadow-shadow">
              {t.common.availability}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
