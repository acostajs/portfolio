import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "./useTranslation";
import { fetchPublic } from "../api";
import { useChat } from "../context/ChatContext";
import { Suggestion } from "../../src/types/chat";

export const useLiveChat = (previousPage: string = "home") => {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const chat = useChat();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [hints, setHints] = useState<string[]>([]);

  // Fetch hints on mount or when previousPage/locale changes
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

  const handleSend = useCallback(
    async (overrideMessage?: string) => {
      const userMessage = (overrideMessage || input).trim();
      if (!userMessage || chat.isLoading) return;

      setInput("");
      
      // Handle slash commands locally or via chat context? 
      // Commands like /about navigate, so we keep that logic here or in context.
      // Moving navigation to a hook is fine.
      
      const cleanCmd = userMessage.toLowerCase().trim();
      if (cleanCmd === "/clear" || cleanCmd === "/new") {
        chat.resetChat();
        return;
      }

      if (cleanCmd === "/help") {
        const helpContent = `${t.home.commands.help}\n\n${t.home.commands.list
          .map((item) => `- **${item.cmd}**: ${item.desc}`)
          .join(
            "\n",
          )}\n\n${t.home.commands.subjectsTitle}\n\n${t.home.commands.subjects
          .map((subject) => `- ${subject}`)
          .join("\n")}`;

        chat.addMessage("user", userMessage);
        chat.addMessage("assistant", helpContent, { shouldAnimate: true });
        return;
      }

      const navMatch = ["/about", "/experience", "/projects", "/blog", "/contact"].find(
        (n) => cleanCmd === n
      );
      if (navMatch) {
        navigate(navMatch);
        return;
      }

      // If it's not a local command, send to context
      await chat.sendMessage(userMessage, previousPage);
    },
    [input, chat, navigate, previousPage, t.home.commands]
  );

  const commandSuggestions = t.home.commands.list.filter((cmd) =>
    cmd.cmd.toLowerCase().startsWith(input.toLowerCase()),
  );

  const activeSuggestions: Suggestion[] = (
    input.startsWith("/")
      ? commandSuggestions.map((s) => ({
          text: s.cmd,
          subtext: s.desc,
          value: s.cmd,
          isCommand: true,
        }))
      : !input && isFocused && !chat.isLoading
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
  ).filter(() => !chat.isLive);

  return {
    messages: chat.messages,
    input,
    setInput,
    isLoading: chat.isLoading,
    isLive: chat.isLive,
    isFocused,
    setIsFocused,
    suggestionIndex,
    setSuggestionIndex,
    hints,
    activeSuggestions,
    handleSend,
    handleFeedback: chat.sendFeedback,
  };
};
