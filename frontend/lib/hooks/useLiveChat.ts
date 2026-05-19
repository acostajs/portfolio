import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "./useTranslation";
import { postPublic, fetchPublic } from "../api";
import { hapticFeedback } from "../haptic";
import { getSessionId } from "../session";
import { Message, ChatResponse, ChatSyncResponse } from "../../src/types/chat";

export const useLiveChat = (previousPage: string = "home") => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
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

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [hints, setHints] = useState<string[]>([]);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const loadHints = async () => {
      try {
        const data = await fetchPublic<string[]>(
          `/chat/hints?page_id=${previousPage}&lang=${locale}`,
        );
        setHints(data);
      } catch (e) {
        console.error("Failed to fetch hints:", e);
      }
    };
    loadHints();
  }, [previousPage, locale]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isLive) {
      interval = setInterval(async () => {
        try {
          const data = await fetchPublic<ChatSyncResponse>(
            `/chat/sync/${sessionId}`,
          );

          if (!data.is_active && isLive) {
            setIsLive(false);
          }

          setMessages((prev) => {
            const updated = [...prev];
            let changed = false;

            data.messages.forEach((dbMsg) => {
              const existingIdx = updated.findIndex((m) => m.id === dbMsg.id);
              if (existingIdx !== -1) return;

              const matchIdx = updated.findIndex(
                (m) =>
                  !m.id &&
                  m.role === dbMsg.role &&
                  m.content.trim() === dbMsg.content.trim(),
              );

              if (matchIdx !== -1) {
                updated[matchIdx] = { ...updated[matchIdx], id: dbMsg.id };
                changed = true;
              } else {
                updated.push({ ...dbMsg, shouldAnimate: true });
                changed = true;
              }
            });

            if (changed) hapticFeedback(10);
            return changed ? updated : prev;
          });
        } catch (e) {
          console.error("Sync error:", e);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, sessionId]);

  useEffect(() => {
    localStorage.setItem("portfolio-chat-history", JSON.stringify(messages));
  }, [messages]);

  const handleNewChat = useCallback(() => {
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

  const handleCommand = useCallback(
    (cmd: string): boolean => {
      const cleanCmd = cmd.toLowerCase().trim();

      if (cleanCmd === "/clear" || cleanCmd === "/new") {
        handleNewChat();
        return true;
      }

      if (cleanCmd === "/help") {
        const helpContent = `${t.home.commands.help}\n\n${t.home.commands.list
          .map((item) => `- **${item.cmd}**: ${item.desc}`)
          .join(
            "\n",
          )}\n\n${t.home.commands.subjectsTitle}\n\n${t.home.commands.subjects
          .map((subject) => `- ${subject}`)
          .join("\n")}`;

        setMessages((prev) => [
          ...prev,
          { role: "user", content: cmd },
          { role: "assistant", content: helpContent, shouldAnimate: true },
        ]);
        return true;
      }

      const navMatch = [
        "/about",
        "/experience",
        "/projects",
        "/blog",
        "/contact",
      ].find((n) => cleanCmd === n);

      if (navMatch) {
        navigate(navMatch);
        return true;
      }

      if (cleanCmd === "/live-chat" || cleanCmd === "/close-live-chat") {
        return false;
      }

      if (cleanCmd.startsWith("/")) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: cmd },
          {
            role: "assistant",
            content: t.home.commands.error,
            shouldAnimate: true,
          },
        ]);
        return true;
      }

      return false;
    },
    [navigate, t.home.commands, handleNewChat],
  );

  const handleSend = useCallback(
    async (overrideMessage?: string) => {
      const userMessage = (overrideMessage || input).trim();
      if (!userMessage || isLoading) return;

      hapticFeedback(15);
      setInput("");

      if (handleCommand(userMessage)) return;

      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
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
          message: userMessage,
          language: locale,
          session_id: sessionId,
          page_id: previousPage,
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
    },
    [input, isLoading, handleCommand, locale, sessionId, previousPage, t.home.errorRetry],
  );

  const handleFeedback = useCallback(
    async (
      isHelpful: boolean,
      userMessage: string,
      assistantReply: string,
      module?: string,
      category?: string,
    ) => {
      try {
        await postPublic("/chat/feedback", {
          user_message: userMessage,
          assistant_reply: assistantReply,
          is_helpful: isHelpful,
          module,
          category,
        });
      } catch (error) {
        console.error("Feedback error:", error);
      }
    },
    [],
  );

  const commandSuggestions = t.home.commands.list.filter((cmd) =>
    cmd.cmd.toLowerCase().startsWith(input.toLowerCase()),
  );

  const activeSuggestions = (
    input.startsWith("/")
      ? commandSuggestions.map((s) => ({
          text: s.cmd,
          subtext: s.desc,
          value: s.cmd,
          isCommand: true,
        }))
      : !input && isFocused && !isLoading
        ? [
            {
              text: t.home.newChat,
              subtext: t.home.commands.list.find((c) => c.cmd === "/clear")
                ?.desc,
              value: "/clear",
              isCommand: true,
            },
            ...t.home.suggestions.map((s) => ({
              text: s,
              subtext: undefined,
              value: s,
              isCommand: false,
            })),
          ]
        : []
  ).filter(() => !isLive);

  return {
    messages,
    input,
    setInput,
    isLoading,
    isLive,
    isFocused,
    setIsFocused,
    suggestionIndex,
    setSuggestionIndex,
    hints,
    activeSuggestions,
    handleSend,
    handleFeedback,
  };
};
