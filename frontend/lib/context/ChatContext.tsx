import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { Message, ChatResponse } from "../../src/types/chat";
import { getSessionId } from "../session";
import { useTranslation } from "../hooks/useTranslation";
import { postPublic } from "../api";
import { hapticFeedback } from "../haptic";

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  isLive: boolean;
  sessionId: string;
  sendMessage: (content: string, pageId: string) => Promise<void>;
  addMessage: (role: "user" | "assistant", content: string, extra?: Partial<Message>) => void;
  resetChat: () => void;
  sendFeedback: (isHelpful: boolean, userMsg: string, reply: string, module?: string, category?: string) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, locale } = useTranslation();
  const sessionId = getSessionId();

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("portfolio-chat-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: Message) => ({ ...m, shouldAnimate: false }));
      } catch (e) {
        console.error("Failed to parse chat history:", e);
      }
    }
    return [
      {
        role: "assistant",
        content: t.home.welcome,
        isInitial: true,
        shouldAnimate: true,
      },
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
    localStorage.setItem("portfolio-chat-history", JSON.stringify(messages));
  }, [messages]);

  // SSE Stream listener
  useEffect(() => {
    const eventSource = new EventSource(`/api/v1/chat/stream/${sessionId}`);

    eventSource.addEventListener("message", (e) => {
      try {
        const dbMsg = JSON.parse(e.data) as Message;
        
        setMessages((prev) => {
          const updated = [...prev];
          const existingIdx = updated.findIndex((m) => m.id === dbMsg.id);
          if (existingIdx !== -1) return prev;

          const matchIdx = updated.findIndex(
            (m) =>
              !m.id &&
              m.role === dbMsg.role &&
              m.content.trim() === dbMsg.content.trim()
          );

          if (matchIdx !== -1) {
            updated[matchIdx] = { ...updated[matchIdx], id: dbMsg.id };
            return updated;
          } else {
            hapticFeedback(10);
            return [...prev, { ...dbMsg, shouldAnimate: true }];
          }
        });
      } catch (err) {
        console.error("SSE message parse error:", err);
      }
    });

    eventSource.addEventListener("status", (e) => {
      try {
        const data = JSON.parse(e.data);
        setIsLive(data.is_active);
      } catch (err) {
        console.error("SSE status parse error:", err);
      }
    });

    eventSource.onerror = (e) => {
      console.error("SSE Connection error:", e);
      // EventSource handles reconnection automatically
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId]);

  const sendMessage = useCallback(async (content: string, pageId: string) => {
    setMessages((prev) => [...prev, { role: "user", content }]);
    setIsLoading(true);

    try {
      const data = await postPublic<
        {
          message: string;
          language: string;
          session_id: string;
          page_id: string;
          history: { role: string; content: string }[];
        },
        ChatResponse
      >("/chat", {
        message: content,
        language: locale,
        session_id: sessionId,
        page_id: pageId,
        history: messagesRef.current.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      setIsLive(data.is_live);

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            module: data.module,
            category: data.category,
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t.home.errorRetry,
          shouldAnimate: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [locale, sessionId, t.home.errorRetry]);

  const addMessage = useCallback((role: "user" | "assistant", content: string, extra: Partial<Message> = {}) => {
    setMessages((prev) => [...prev, { role, content, ...extra }]);
  }, []);

  const resetChat = useCallback(() => {
    hapticFeedback(25);
    setMessages([
      {
        role: "assistant",
        content: t.home.welcome,
        isInitial: true,
        shouldAnimate: true,
      },
    ]);
    localStorage.removeItem("portfolio-chat-history");
  }, [t.home.welcome]);

  const sendFeedback = useCallback(async (isHelpful: boolean, userMsg: string, reply: string, module?: string, category?: string) => {
    try {
      await postPublic("/chat/feedback", {
        user_message: userMsg,
        assistant_reply: reply,
        is_helpful: isHelpful,
        module,
        category,
      });
    } catch (error) {
      console.error("Feedback error:", error);
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        isLoading,
        isLive,
        sessionId,
        sendMessage,
        addMessage,
        resetChat,
        sendFeedback,
        setIsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
