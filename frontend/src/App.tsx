import { useTranslation } from "../lib/hooks/useTranslation";
import { useTheme } from "../lib/context/ThemeContext";

function App() {
  const { t, locale, setLocale } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <main className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-bg">
      <div className="text-center max-w-2xl">
        <h1 className="text-accent">{t.common.name}</h1>
        <p className="text-xl mb-8">{t.common.role}</p>

        <div className="bg-code-bg p-6 rounded-lg shadow-shadow border border-border">
          <h2 className="text-text-header mb-4">{t.home.welcome}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <section>
              <p className="text-text mb-4 text-sm font-bold uppercase tracking-wider">
                Language
              </p>
              <div className="flex gap-2 justify-center">
                {(["en", "fr", "es"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      locale === l
                        ? "bg-accent text-white"
                        : "bg-white dark:bg-gray-800 text-text border border-border hover:bg-accent-bg"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <p className="text-text mb-4 text-sm font-bold uppercase tracking-wider">
                Theme ({resolvedTheme})
              </p>
              <div className="flex gap-2 justify-center">
                {(["light", "dark", "system"] as const).map((th) => (
                  <button
                    key={th}
                    onClick={() => setTheme(th)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      theme === th
                        ? "bg-accent text-white"
                        : "bg-white dark:bg-gray-800 text-text border border-border hover:bg-accent-bg"
                    }`}
                  >
                    {th.charAt(0).toUpperCase() + th.slice(1)}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8">
          <code>{t.home.chatbotPlaceholder}</code>
        </div>
      </div>
    </main>
  );
}

export default App;
