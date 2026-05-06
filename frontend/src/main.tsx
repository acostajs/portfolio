import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.tsx";
import { LanguageProvider } from "../lib/context/LanguageContext";
import { ThemeProvider } from "../lib/context/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
