import React from 'react';

const Popup = ({ data, onClose }) => {
    console.log('data from popup',data);
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Result</h2>
        {data && (
          <div>
            {/* Assuming the 'username' property exists in the data */}
            <p>Username: {data.username}</p>
            {/* Display other relevant data */}
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;