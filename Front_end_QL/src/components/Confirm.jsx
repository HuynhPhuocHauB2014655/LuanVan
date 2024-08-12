import React from 'react';

const AlterConfirm = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message}</p>
        <div className="confirm-buttons">
          <button onClick={onConfirm} id="confirm-yes">Yes</button>
          <button onClick={onCancel} id="confirm-no">No</button>
        </div>
      </div>
    </div>
  );
};

export default AlterConfirm;