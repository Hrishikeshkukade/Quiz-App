import React from "react";
import { ReactComponent as Sun } from "../../assets/Sun.svg";
import { ReactComponent as Moon } from "../../assets/Moon.svg";
import "./DarkTheme.css";
import { useTheme } from "../../context/ThemeContext"; // Import the useTheme hook

const DarkTheme = () => {
    const { theme, toggleTheme } = useTheme(); // Access theme and toggleTheme from the ThemeContext

    // Function to toggle the theme
    const toggleThemeHandler = () => {
        toggleTheme();
    };

    return (
        <div className={`dark_mode ${theme === "dark" ? "" : ""}`}>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                checked={theme === "dark"} // Set the checkbox state based on the current theme
                onChange={toggleThemeHandler} // Call toggleThemeHandler when the checkbox changes
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkTheme;

