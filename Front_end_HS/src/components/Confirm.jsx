import React from 'react';

const AlterConfirm = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message}</p>
        <div className="confirm-buttons">
          <button onClick={onConfirm} id="confirm-yes">Có</button>
          <button onClick={onCancel} id="confirm-no">Không</button>
        </div>
      </div>
    </div>
  );
};

export default AlterConfirm;