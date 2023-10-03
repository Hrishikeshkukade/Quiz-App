import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styles from './ErrorModalStyles';

function ErrorModal({ show, onClose, errorMessage }) {


  return (
    <Modal show={show} onHide={onClose}>
      <div style={styles.modal}>
        <Modal.Header closeButton>
          <Modal.Title style={styles.error}>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.errorMessage}>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default ErrorModal;
