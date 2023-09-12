import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import './About.css'; // Create a CSS file for custom styles

const About = () => {
  return (
    <div className="about-section">
      <Container>
        <h1>About Our Quiz Website</h1>
        <Row>
          <Col md={6}>
            <div className="about-content">
              <h2>Welcome to quizknowledge!</h2>
              <p>
                At quizknowledge, we're passionate about quizzes and learning. Our mission is to provide an engaging platform for users to test their knowledge, learn new things, and have fun.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="about-content">
              <h2>Why Choose quizknowledge?</h2>
              <p>
                <strong>Wide Range of Quizzes:</strong> We offer a diverse selection of quizzes on various topics, from general knowledge to specific subjects.
              </p>
              {/* Add more content here */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;

