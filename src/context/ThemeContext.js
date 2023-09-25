import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Read the theme setting from localStorage (if available) or default to "light"
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Function to toggle the theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Toggle the "darkTheme" class on the body element
    document.body.classList.toggle("darkTheme", newTheme === "dark");

    // Save the theme setting to localStorage
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    // Retrieve the theme from localStorage when the component mounts
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.body.classList.toggle("darkTheme", storedTheme === "dark");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
