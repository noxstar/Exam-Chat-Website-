import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReplyForm from './ReplyForm';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';


const MessageList = ({userId,username}) => {
  const { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  
    const fetchMessages = async (channelId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8086/getChannelMessages/${channelId}`);
        const data = await response.json();
        console.log('Fetched data:', data);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Error fetching messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchMessages(channelId);
  }, [channelId]);

  const handleDeletePost = (messageId) => {
    // Send a request to delete the post
    axios.delete(`http://localhost:8086/removePost/${messageId}`)
      .then((response) => {
        console.log(response.data.message);
        // Refresh the post list after deletion
        axios.get(`http://localhost:8086/getChannelMessages/${channelId}`)
          .then((response) => setMessages(response.data))
          .catch((error) => console.error('Error fetching posts:', error));
      })
      .catch((error) => console.error('Error deleting post:', error));
  };

  const renderReplies = (replies, level = 1,parentUsername) => {
    if (!replies || replies.length === 0) {
      return null;
    }

    return (
      <ul className={`replyList level-${level}`}>
        {replies.map((reply) => (
          <li key={reply.id} className="replyItem">
            <div>{reply.content}</div>
            <div className="replyUsername">Reply to: {parentUsername}</div>
            {/* Other reply details */}
            {renderReplies(reply.replies, level + 1, reply.username)}
            <ReplyForm parentMessageId={reply.id} onReply={handleReply} userId={userId} />
          </li>
        ))}
      </ul>
      // <div>
      // {replies.map((reply) => (
      //   <div key={reply.id} className="replyItem" style={{ marginLeft: `${level * 20}px` }}>
      //     <div>{reply.content}</div>
      //     {reply.image_path && <img src={`http://localhost:8086/${reply.image_path}`} alt="Message Image" />}
      //     <div>Likes : {reply.approval_count}</div>
      //     <div>Dislikes: {reply.disapproval_count}</div>
      //     <button onClick={() => handleApproval(reply.id)}>
      //       <FontAwesomeIcon icon={faThumbsUp} /> Like
      //     </button>
      //     <button onClick={() => handleDisapproval(reply.id)}>
      //       <FontAwesomeIcon icon={faThumbsDown} /> Dislike
      //     </button>
      //     <ReplyForm parentMessageId={reply.id} onReply={handleReply} userId={userId} />
      //     {renderReplies(reply.replies, level + 1)}
      //   </div>
    //   ))}
    // </div>
    );
  };

 
      // Make a POST request to handle approval
      const handleApproval = async (messageId) => {
        try {
          await fetch(`http://localhost:8086/approve/${messageId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
            }),
          });
    
          // After approving, refresh the messages
          fetchMessages(channelId);
        } catch (error) {
          console.error('Error approving message:', error);
        }
      };
    
  const handleDisapproval = async (messageId) => {
    try {
      // Make a POST request to handle disapproval
      await fetch(`http://localhost:8086/disapprove/${messageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      // After handling disapproval, refresh the messages
      fetchMessages(channelId);
    } catch (error) {
      console.error('Error handling disapproval:', error);
    }
  };


  const handleReply = async (parentMessageId, replyContent) => {
    try {
      if (!userId) {
        console.error('User is not logged in');
        return;
      }
  
      // If parentMessageId is not provided, it means the reply is for the original message
      const parentMessage = parentMessageId
        ? messages.find((message) => message.message_id === parentMessageId)
        : null;
  
      const channelId = parentMessage ? parentMessage.channel_id : messages[0]?.channel_id;
  
      if (!channelId) {
        console.error('Channel ID not found');
        return;
      }
  
      // Make a POST request to add a new reply
      await fetch(`http://localhost:8086/postReply/${channelId}/${parentMessageId || ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          user_id: userId,
        }),
      });
  
      console.log(parentMessage);
      console.log(channelId);
  
      // After posting a reply, refresh the messages
      fetchMessages(channelId);
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };




  if (loading) {
    return <p>Loading messages...</p>; // You can replace this with a loading spinner
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="messageContainer">
    <h2>Messages</h2>
    <ul className="messageList">
      {messages.map((message) => (
        <li key={message.message_id} className="messageItem">
          <div>{username}</div>
          <div className="messageUsername">User: {message.username}</div>
          <div className="messageContent">{message.content}</div>
          {message.image_path && <img src={`http://localhost:8086/${message.image_path}`} alt="Message Image" className="messageImage" />}
          <div className="messageLikes">Likes: {message.approval_count}</div>
          <div className="messageDislikes">Dislikes: {message.disapproval_count}</div>
          <button onClick={() => handleApproval(message.message_id)} className="likeButton">
            <FontAwesomeIcon icon={faThumbsUp} /> Like
          </button>
          <button onClick={() => handleDisapproval(message.message_id)} className="dislikeButton">
            <FontAwesomeIcon icon={faThumbsDown} /> Dislike
          </button>
          <button onClick={() => handleDeletePost(message.message_id)}>Delete</button>
          {renderReplies(message.replies, 1, message.username)}
          <ReplyForm parentMessageId={message.message_id} onReply={handleReply} userId={userId} />
        </li>
      ))}
    </ul>
  </div>
  );
};

export default MessageList;