import React, { useState } from 'react';

const ReplyForm = ({ parentMessageId, onReply, userId }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async () => {
    if (!replyContent.trim()) {
      console.error('Reply content is empty');
      return;
    }

    onReply(parentMessageId, replyContent,userId);
    setReplyContent(''); // Clear the input field after posting the reply
  };

  return (
    <div className="replyFormContainer">
      <input
        type="text"
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Type your reply..."
        className="replyInput"
      />
      <button onClick={handleReply} className="replyButton">
        Reply
      </button>
    </div>
  );
};

export default ReplyForm;