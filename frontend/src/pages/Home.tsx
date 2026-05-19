import React from "react";
import SEO from "../components/layout/SEO";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInputContainer from "../components/chat/ChatInputContainer";
import { useLiveChat } from "../../lib/hooks/useLiveChat";

interface HomeProps {
  previousPage?: string;
}

const Home: React.FC<HomeProps> = ({ previousPage = "home" }) => {
  const chat = useLiveChat(previousPage);

  return (
    <section className="flex-1 flex flex-col h-full overflow-hidden">
      <SEO />
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        isLive={chat.isLive}
        handleSend={chat.handleSend}
        handleFeedback={chat.handleFeedback}
      />
      <ChatInputContainer
        input={chat.input}
        setInput={chat.setInput}
        isLoading={chat.isLoading}
        isLive={chat.isLive}
        setIsFocused={chat.setIsFocused}
        suggestionIndex={chat.suggestionIndex}
        setSuggestionIndex={chat.setSuggestionIndex}
        hints={chat.hints}
        activeSuggestions={chat.activeSuggestions}
        handleSend={chat.handleSend}
      />
    </section>
  );
};

export default Home;
