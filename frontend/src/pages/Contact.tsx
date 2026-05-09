import React, { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "../../lib/hooks/useTranslation";
import { Mail, MessageSquare, User, Send, Loader2 } from "lucide-react";

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const object = Object.fromEntries(formData);

    // Web3Forms configuration
    const json = JSON.stringify({
      ...object,
      access_key: import.meta.env.VITE_WEB3FORMS_KEY || "",
      subject: "New Message from Portfolio Contact Form",
      from_name: object.name,
    });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t.contact.successTitle, {
          description: t.contact.successMessage,
        });
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(t.contact.errorMessage);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(t.contact.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <section className="max-w-3xl mx-auto">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-text-header mb-4">
            {t.contact.title}
          </h1>
          <p className="text-text mb-10 text-lg">{t.contact.p1}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot Spam Protection */}
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            style={{ display: "none" }}
          ></input>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="contact-name"
                className="text-xs font-bold uppercase tracking-widest text-text opacity-70 ml-1"
              >
                {t.contact.formName}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50" />
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-border focus:border-accent rounded-xl outline-none transition-all text-text-header"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="contact-email"
                className="text-xs font-bold uppercase tracking-widest text-text opacity-70 ml-1"
              >
                {t.contact.formEmail}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50" />
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-border focus:border-accent rounded-xl outline-none transition-all text-text-header"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact-message"
              className="text-xs font-bold uppercase tracking-widest text-text opacity-70 ml-1"
            >
              {t.contact.formMessage}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-text opacity-50" />
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-border focus:border-accent rounded-xl outline-none transition-all text-text-header resize-none"
                placeholder="..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            {t.contact.formSend}
          </button>
        </form>
      </section>
    </article>
  );
};

export default Contact;
