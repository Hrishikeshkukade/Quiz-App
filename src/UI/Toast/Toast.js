import React from 'react';
import './Toast.css'; // You can create a CSS file for styling

const Toast = ({ message, type, onClose }) => {
    return (
      <div className={`toast ${type}`}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {message}
      </div>
    );
  };
  
  export default Toast;
  