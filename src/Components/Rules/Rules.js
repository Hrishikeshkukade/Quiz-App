import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './RulesStyle';

const Rules = ({ show, onHide, onAccept }) => {


  return (
    <Modal show={show} onHide={onHide}>
      <div style={styles.darkModal}>
        <Modal.Header closeButton>
          <Modal.Title>Quiz Rules</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            1.Time Limit: You will have a limited amount of time to complete the
            quiz. Make sure to finish within the given time.
          </p>
          <p>
            2.Answer Format: Answer all questions according to the specified
            format (e.g., select one correct option or provide a short answer).
          </p>
          <p>
            3.Submit Answers: After answering all questions, click the "Submit"
            button to record your responses.
          </p>
          <p>
            4.Scoring: Your score will be calculated based on the number of
            correct answers.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={onAccept}>
            Accept Rules
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default Rules;
