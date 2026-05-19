import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";
import "./styles/globals.css";
import App from "./App.tsx";
import { LanguageProvider } from "../lib/context/LanguageContext";
import { ThemeProvider } from "../lib/context/ThemeContext";
import { ChatProvider } from "../lib/context/ChatContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <ChatProvider>
              <App />
              <Analytics />
              <SpeedInsights />
            </ChatProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
