import React from "react";
import { X, Link as LinkIcon, Share2 } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "../../../lib/haptic";

interface SocialShareProps {
  title: string;
  url: string;
  text?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ title, url, text }) => {
  const shareUrl = url.startsWith("http")
    ? url
    : `https://acostajs.vercel.app${url}`;
  const shareText = text || title;

  const handleCopyLink = () => {
    hapticFeedback(10);
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: X,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "LinkedIn",
      icon: LinkIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-[#0077b5]",
    },
  ];

  const handleNativeShare = async () => {
    hapticFeedback(15);
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Native share failed:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-text opacity-40 mr-2">
        Share:
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => hapticFeedback(5)}
          className={`p-2 rounded-lg bg-white/5 border border-border text-text transition-all ${link.color} hover:bg-white/10`}
          title={`Share on ${link.name}`}
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-lg bg-white/5 border border-border text-text transition-all hover:text-accent hover:bg-white/10"
        title="Copy Link"
        aria-label="Copy link to clipboard"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        onClick={handleNativeShare}
        className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent transition-all hover:bg-accent/20 sm:hidden"
        title="Share"
        aria-label="Share via system dialog"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SocialShare;
