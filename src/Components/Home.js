import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    marginTop: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
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

const galaxyFoldMediaQuery = "@media (max-width: 500px)";

// Apply styles for Galaxy Fold
const galaxyFoldStyles = {
  container: {
   textAlign: "center", // Adjusted margin for smaller screens
  },

};
const mergedStyles = {
  ...styles,
  ...{
    [galaxyFoldMediaQuery]: galaxyFoldStyles,
  },
};

const Home = () => {
  return (
    <>
      <div style={mergedStyles.container}>
        <h1>Quiz</h1>
      </div>
      <div style={mergedStyles.container}>
        <h2>Register for quiz and build your knowledge</h2>
      </div>
      {/* <Container style={styles.container}>
        <Row>
          <Col>
            <h1>Quiz</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Register for quiz and build your knowledge</h3>
          </Col>
        </Row>
      </Container> */}
      <div style={mergedStyles.buttonContainer}>
        <Button as={Link} to="/register" size="lg" style={mergedStyles.button} className="m-1">
          Register
        </Button>

        <Button as={Link} to="/about" size="lg" style={mergedStyles.button2} className="m-1">
          Know more
        </Button>
      </div>
    </>
  );
};

export default Home;
