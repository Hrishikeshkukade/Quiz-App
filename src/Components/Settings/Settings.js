import React, { useEffect } from "react";
import classes from "./Settings.module.css"; // Import your component-specific styles
import "../../config/styles.css";

import { useTheme } from "../../context/ThemeContext";
import DarkTheme from "../DarkTheme/DarkTheme";

const Settings = () => {
  // Initialize the theme state with a default value (e.g., 'light')
  //   const [theme, setTheme] = useState("light");
  const { theme, toggleTheme } = useTheme();

  // Function to handle theme change
  // const handleThemeChange = (event) => {
  //   // setTheme(event.target.value);
  //   toggleTheme();
  //   // You can save the selected theme to local storage or some global state here
  // };

  // useEffect(() => {
  //   const storedTheme = localStorage.getItem("theme");
  //   if (storedTheme) {
  //     toggleTheme(); // Toggle to the stored theme to apply it
  //   }
  // }, [toggleTheme]);

//   useEffect(() => {
//     // Add or remove the "darkTheme" class based on the theme state
//     document.body.classList.toggle("darkTheme", theme === "dark");
//   }, [theme]);

  return (
    <div className={classes.container}
    //   className={`${classes.container} ${
    //     theme === "dark" ? "darkTheme" : "lightTheme"
    //   }`}
    >
      <h2>Settings</h2>
      <div>
        <h3>Theme Options</h3>
        <label htmlFor="themeSelect">Select Theme:</label>
        <DarkTheme />
      </div>
    </div>
  );
};

export default Settings;
