import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ErrorModal({ show, onClose, errorMessage }) {
    const styles = {
        error: {
            color: "red",
            fontWeight: "bold",
          },
          errorMessage: {
            color: "red",
          }
    }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title style={styles.error} >Error</Modal.Title>
      </Modal.Header>
      <Modal.Body style={styles.errorMessage}>{errorMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;
