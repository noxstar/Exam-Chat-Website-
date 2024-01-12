import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChannelList = ({ channels, onChannelClick }) => {

    const [ setChannels] = useState([]);

  
    const handleDeleteChannel = (channelId) => {
        // Send a request to delete the channel
        axios.delete(`http://localhost:8086/removeChannel/${channelId}`)
          .then((response) => {
            console.log(response.data.message);
            // Refresh the channel list after deletion
            axios.get('http://localhost:8086/getAllChannels')
              .then((response) => setChannels(response.data))
              .catch((error) => console.error('Error fetching channels:', error));
          })
          .catch((error) => console.error('Error deleting channel:', error));
      };
  return (
    <div>
      <h2>Channel List</h2>
    <ul className="clickableList">
        {channels.map((channel) => (
          
            <li key={channel.id} onClick={() => onChannelClick(channel)}>
            {channel.name}
            <button onClick={() => handleDeleteChannel(channel.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
