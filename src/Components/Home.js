import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import classes from "./Home.module.css";

const styles = {
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    borderRadius: "20px",
    backgroundColor: "#FF5722",
    border: "none",
  },

  button2: {
    backgroundColor: "#2196F3 ",
    borderRadius: "20px",
    border: "none",
  },
  row1: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "center",
  },
  row2: {
    display: "flex",
    justifyContent: "center",
  },
};

const Home = () => {
  return (
    <>
      <div className={classes.container}>
        <h1>Quiz</h1>
      </div>
      <div className={classes.container2}>
        <h2>Register for quiz and build your knowledge</h2>
      </div>

      <div style={styles.buttonContainer}>
        <Button
          as={Link}
          to="/register"
          size="lg"
          style={styles.button}
          className="m-1"
        >
          Register
        </Button>

        <Button
          as={Link}
          to="/about"
          size="lg"
          style={styles.button2}
          className="m-1"
        >
          Know more
        </Button>
      </div>
    </>
  );
};

export default Home;
