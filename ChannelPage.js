import React, { useState, useEffect } from 'react';
import ChannelList from './ChannelList';
import CreateChannel from './CreateChannel';
import MessageList from './MessageList';
import PostMessage from './PostMessage';
import Popup from './Popup';

import { useNavigate, useParams} from 'react-router-dom';

const ChannelPage = ({ loggedIn, setLoggedIn, userId }) => {
  const { channelId } = useParams();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [mostPostsData, setMostPostsData] = useState(null);
const [highestRankingData, setHighestRankingData] = useState(null);

  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of channels when the component mounts
    fetchChannels();
  }, []);

  useEffect(() => {
    // Set the selected channel when the channelId changes
    const channel = channels.find((channel) => channel.id === parseInt(channelId));
    setSelectedChannel(channel);

    //Fetch messages for the selected channel
    if (channel) {
      fetchMessages(channel.id);
    }
  }, [channelId, channels]);


  const fetchChannels = async () => {
    setLoadingChannels(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8086/getAllChannels');
      const data = await response.json();
      setChannels(data);
    } catch (error) {
      console.error('Error fetching channels:', error);
      setError('Error fetching channels. Please try again.');
    } finally {
      setLoadingChannels(false);
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const response = await fetch(`http://localhost:8086/getChannelMessages/${channelId}`);
      const data = await response.json();
      const messagesWithUserId = data.map((message) => ({ ...message, userId: message.user_id }));



      setMessages(messagesWithUserId);
  } catch (error) {
    console.error('Error fetching messages:', error);
    setError('Error fetching messages. Please try again.');
  } finally {
    setLoadingChannels(false);
  }
};

  const handleChannelClick = (channel) => {
    // Set the selected channel when a channel is clicked
    setSelectedChannel(channel);
    // Fetch messages for the selected channel
    fetchMessages(channel.id);

    // Navigate to a new page for the selected channel
    navigate(`/channel/${channel.id}`);

  };

  const handlePostMessage = async (channelId, message,image) => {
    try {
      console.error(userId);
      
      if (!loggedIn || !userId) {
        console.error(loggedIn);
        console.error(userId);

        console.error('User is not logged in');
        return; // Do not proceed if the user is not logged in
      }

      if (!message || message.trim() === '') {
        console.error('Message content is null or empty');
        return; // Do not proceed with the request if the message content is invalid
      }

      console.error(userId);

      // Make a POST request to add a new message
      await fetch(`http://localhost:8086/postMessage/${channelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
        user_id: userId,
      }),
    });
    // Call the onPostMessage function with the new message
    //onPostMessage(channelId, message);


    console.log(userId);
      /// Fetch updated messages after posting
      fetchMessages(channelId);
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const handlePostImage = async (channel_id,message,image) => {
    try {
      if (!loggedIn || !userId) {
        console.error('User is not logged in');
        return; // Do not proceed if the user is not logged in
      }
  
      // if (!image) {
      //   console.error('No image selected');
      //   return; // Do not proceed with the request if no image is selected
      // }
  
      const formData = new FormData();
      //formData.append('channel_id', channel_id);
      formData.append('content', message); // Assuming you have messageContent in your state
      formData.append('user_id', userId);
      formData.append('imageBase64', image);
  
      await fetch(`http://localhost:8086/postImage/${channelId}`, {
        method: 'POST',
        body: formData,
      });
  
      // Refresh messages or update state
      fetchMessages(channelId);
      // Reset the image state
      setImage(null);
    } catch (error) {
      console.error('Error posting image:', error);
    }
  };

  

  const handleCreateChannel = async (channelName) => {
    try {
      // Make a POST request to create a new channel
      await fetch('http://localhost:8086/createChannel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelName: channelName,
        }),
      });

      // Refresh the list of channels
      fetchChannels();
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };
  const handleMostPostsClick = async () => {
    try {
      const response = await fetch('http://localhost:8086/usersWithMostPosts');
      const data = await response.json();
      console.log('Most Posts Data:', data);
      setMostPostsData(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching users with most posts:', error);
    }
  };

  const handleHighestRankingClick = async () => {
    try {
      const response = await fetch('http://localhost:8086/usersWithHighestRanking');
      const data = await response.json();

      console.log('Highest Ranking Data:', data);
      setHighestRankingData(data);
    } catch (error) {
      console.error('Error fetching users with highest ranking:', error);
    }
  };

  const closePopup = () => {
    setMostPostsData(null);
    setHighestRankingData(null);
  };

  



  const handleLogout = () => {
    setLoggedIn(false);
    // Perform logout logic (clear user info, navigate to home, etc.)
    navigate('/');
  };

  return (
    <div className="channel-page-container">
      <h1>Channel Page</h1>
      <button onClick={handleLogout}>Logout</button>

      <button onClick={handleMostPostsClick}>Get User with Most Posts</button>
      <button onClick={handleHighestRankingClick}>Get User with Highest Ranking</button>

      {mostPostsData && mostPostsData.length > 0 && (
        <Popup data={mostPostsData[0]} onClose={closePopup} />
      )}

      {highestRankingData && highestRankingData.length > 0 && (
        <Popup data={highestRankingData[0]} onClose={closePopup} />
      )}

      <div className="channel-list-container">
        <ChannelList channels={channels} onChannelClick={handleChannelClick} />
        <button className="create-channel-button" onClick={() => setShowCreateChannel(true)}>
          Create Channel
        </button>
        {showCreateChannel && (
          <CreateChannel onCreateChannel={handleCreateChannel} onCancel={() => setShowCreateChannel(false)} />
        )}
      </div>

      {selectedChannel && (
        <div className="message-container">
          <MessageList messages={messages} channelId={selectedChannel.id} userId={userId} />
          <PostMessage
            channelId={selectedChannel.id}
            onPostMessage={handlePostMessage}
            onPostImage={handlePostImage}
            loggedIn={loggedIn}
            userId={userId}
          />
        </div>
      )}
    </div>
  );
};

export default ChannelPage;