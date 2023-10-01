import React from "react";
import classes from "./Settings.module.css"; // Import your component-specific styles
import "../../config/styles.css";

import DarkTheme from "../DarkTheme/DarkTheme";

const Settings = () => {
  return (
    <div className={classes.container}>
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
