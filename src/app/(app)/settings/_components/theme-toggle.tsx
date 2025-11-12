// app/settings/_components/theme-toggle.tsx
"use client";

import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  useEffect(() => {
    // Get theme from localStorage or default to light
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark" | "system") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const themes = [
    { value: "light", label: "Light", icon: Sun, bg: "bg-yellow-300" },
    { value: "dark", label: "Dark", icon: Moon, bg: "bg-gray-700" },
    { value: "system", label: "System", icon: Monitor, bg: "bg-blue-300" },
  ] as const;

  return (
    <div>
      <Text as="p" className="mb-4 block text-sm font-bold uppercase">
        Theme Preference
      </Text>

      <div className="grid grid-cols-3 gap-4">
        {themes.map(({ value, label, icon: Icon, bg }) => (
          <button
            key={value}
            onClick={() => handleThemeChange(value)}
            className="focus:outline-none"
          >
            <Card
              className={`cursor-pointer border-2 p-6 text-center transition-all ${
                theme === value
                  ? "border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  : "border-2 border-gray-300 hover:border-black"
              } ${bg}`}
            >
              <Icon className="mx-auto mb-3 h-8 w-8" strokeWidth={3} />
              <Text as="p" className="text-sm font-black">
                {label.toUpperCase()}
              </Text>
              {theme === value && (
                <div className="mt-2">
                  <span className="bg-black px-2 py-0.5 text-xs font-bold text-white">
                    ACTIVE
                  </span>
                </div>
              )}
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
};
