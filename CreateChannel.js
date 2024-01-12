import React, { useState } from 'react';

const CreateChannel = ({ onCreateChannel }) => {
  const [channelName, setChannelName] = useState('');

  const handleInputChange = (event) => {
    setChannelName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Call the provided callback to create a new channel
    onCreateChannel(channelName);

    // Clear the input field
    setChannelName('');
  };

  return (
    <div className="createChannelContainer">
      <h2>Create Channel</h2>
      <form onSubmit={handleSubmit} className="createChannelForm">
        <input
          type="text"
          placeholder="Enter channel name"
          value={channelName}
          onChange={handleInputChange}
          className="createChannelInput"
        />
        <button type="submit" className="blueButton">Create</button>
      </form>
    </div>
  );
};

export default CreateChannel;