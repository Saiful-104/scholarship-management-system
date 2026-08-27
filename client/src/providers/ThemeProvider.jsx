import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Apply theme to HTML element
  const applyTheme = (dark) => {
    const htmlElement = document.documentElement;
    if (dark) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Initialize theme on component mount
  useEffect(() => {
    // Apply theme immediately to avoid flash
    const savedTheme = localStorage.getItem("theme");

    let isDarkMode;
    if (savedTheme !== null) {
      // Use saved preference
      isDarkMode = savedTheme === "dark";
    } else {
      // Use system preference
      isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setIsDark(isDarkMode);
    applyTheme(isDarkMode);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (localStorage.getItem("theme") === null) {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle theme and save preference
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
  };

  const themeValue = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;