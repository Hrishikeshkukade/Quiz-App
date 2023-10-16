import React, { useEffect, useState } from "react";
import styles from "./TimerStyles";

const Timer = ({ initialTime, startQuiz, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    let timer;
  
    if (startQuiz) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
  
      setTimeout(() => {
        clearInterval(timer);
        onTimeUp(); // Callback function when time is up
      }, initialTime * 1000);
    }
  
    return () => clearInterval(timer); // Clear the interval when unmounting or when startQuiz becomes false
  }, [startQuiz, initialTime, onTimeUp, timeLeft]);
  

  return (
    <div style={styles.button2}>
      <p style={styles.timeDisplay}>Time Left: {timeLeft} seconds</p>
    </div>
  );
};

export default Timer;
