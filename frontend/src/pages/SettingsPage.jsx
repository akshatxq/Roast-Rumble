"use client"

import { THEMES } from "../constants/index.js"
import { useThemeStore } from "../store/useThemeStore.js"

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
]

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Heading */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        {/* Theme selection grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-base-100"></div>
                </div>
              </div>
              <span className="text-xs text-center capitalize">{t}</span>
            </button>
          ))}
        </div>

        {/* Preview chat window */}
        <div className="mt-8 border rounded-lg p-4" data-theme={theme}>
          <div className="space-y-2">
            {PREVIEW_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.isSent
                    ? "ml-auto bg-primary text-primary-content"
                    : "mr-auto bg-base-200 text-base-content"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
