import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import classes from "./Home.module.css";
import styles from "./HomeStyle";


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
