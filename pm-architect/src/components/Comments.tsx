"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  mentions: string[];
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface CommentsProps {
  decisionId: string;
}

export default function Comments({ decisionId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, [decisionId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/decision/${decisionId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(match => match.slice(1)) : [];
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const mentions = extractMentions(newComment);
      const response = await fetch(`/api/decision/${decisionId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          parentId: replyTo,
          mentions,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments(prev => [...prev, newCommentData]);
        setNewComment('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComment = (comment: Comment) => {
    const isReply = comment.parentId !== null;
    
    return (
      <div key={comment.id} className={`${isReply ? 'ml-8' : ''} mb-4`}>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                {comment.user.image ? (
                  <img
                    src={comment.user.image}
                    alt={comment.user.name || comment.user.email}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-300">
                    {comment.user.name?.[0] || comment.user.email[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-200">
                  {comment.user.name || comment.user.email}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="text-gray-300 whitespace-pre-wrap">
                {comment.content.split(' ').map((word, index) => {
                  if (word.startsWith('@')) {
                    return (
                      <span key={index} className="text-blue-400 font-medium">
                        {word}{' '}
                      </span>
                    );
                  }
                  return <span key={index}>{word} </span>;
                })}
              </div>
              {!isReply && (
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-xs text-gray-500 hover:text-gray-300 mt-2"
                >
                  Reply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const topLevelComments = comments.filter(comment => !comment.parentId);
  const replies = comments.filter(comment => comment.parentId);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-200">Comments</h3>
      
      {/* Comment form */}
      {session?.user && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyTo 
                  ? "Write a reply... (use @email@domain.com to mention someone)"
                  : "Write a comment... (use @email@domain.com to mention someone)"
              }
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Use @email@domain.com to mention team members
            </div>
            <div className="flex space-x-2">
              {replyTo && (
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="px-3 py-1 text-sm text-gray-400 hover:text-gray-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? 'Posting...' : replyTo ? 'Reply' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          topLevelComments.map(comment => (
            <div key={comment.id}>
              {renderComment(comment)}
              {/* Render replies */}
              {replies
                .filter(reply => reply.parentId === comment.id)
                .map(reply => renderComment(reply))}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 