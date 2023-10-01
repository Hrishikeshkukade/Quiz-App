import React from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "./ConfirmationModalStyle";

const ConfirmationModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <div style={styles.darkModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit the quiz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Yes, Submit
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
