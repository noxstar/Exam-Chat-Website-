import React, { useState } from 'react';

const PostMessage = ({ channelId, onPostMessage, onPostImage }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  

  const handlePostMessage = () => {
    if (message.trim() === '') {
        // Handle empty message
        return;
    }

    // Call the onPostMessage function with the new message and image
    onPostMessage(channelId, message, image);

    // Clear the input field after posting
    setMessage('');
    setImage(null);
    setImagePreview(null);
};

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    console.log(file); 
    setImage(file);
  };

  const handlePostImage = () => {
    console.log('handlePostImage called');
    // if (!loggedIn || !userId) {
    //   console.error('User is not logged in');
    //   return; // Do not proceed if the user is not logged in
    // }

    if (!image) {
      console.error('No image selected');
      return; // Do not proceed with the request if no image is selected
    }

    // Call the onPostImage function with the image data
    onPostImage(channelId, message, image);

    // Reset the image state
    setImage(null);
  };
  

  return (
    <div className="postMessageContainer">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="messageTextarea"
      />
      <button onClick={handlePostMessage} className="postButton">
        Post Message
      </button>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handlePostImage} className="postImageButton">
        Post Image
      </button>
    </div>
  );
};

export default PostMessage;