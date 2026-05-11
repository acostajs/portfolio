import { useState, useCallback, useRef } from "react";

// Define types for Web Speech API since they might be missing from standard lib
interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef<(text: string) => void>(() => {});

  const startListening = useCallback(
    (lang: string = "en", onResult: (text: string) => void) => {
      onResultRef.current = onResult;

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError("Speech recognition not supported");
        return;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore stop errors
        }
      }

      const recognition = new SpeechRecognition();

      const langMap: Record<string, string> = {
        en: "en-US",
        es: "es-ES",
        fr: "fr-FR",
      };
      recognition.lang = langMap[lang] || lang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error);
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (event.results && event.results.length > 0) {
          const result = event.results[0][0].transcript;
          onResultRef.current(result);
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        setError("Failed to start recognition");
      }
    },
    [],
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speak = useCallback((text: string, lang: string = "en") => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Try to find a natural voice for the language
    const voices = synth.getVoices();
    const voice =
      voices.find(
        (v) => v.lang.startsWith(lang) && v.name.includes("Google"),
      ) || voices.find((v) => v.lang.startsWith(lang));

    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    synth.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
    }
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    error,
  };
};
