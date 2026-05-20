import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "./useTranslation";
import { useChat } from "../context/ChatContext";
import type { Suggestion } from "../../src/types/chat";

export const useLiveChat = (previousPage: string = "home") => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const chat = useChat();

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);


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

      const navMatch = [
        "/about",
        "/experience",
        "/projects",
        "/blog",
        "/contact",
      ].find((n) => cleanCmd === n);
      if (navMatch) {
        navigate(navMatch);
        return;
      }

      // If it's not a local command, send to context
      await chat.sendMessage(userMessage, previousPage);
    },
    [input, chat, navigate, previousPage, t.home.commands],
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
    activeSuggestions,
    handleSend,
    handleFeedback: chat.sendFeedback,
    markMessageAnimated: chat.markMessageAnimated,
  };
};
