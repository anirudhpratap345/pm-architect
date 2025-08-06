"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { commentsApi, handleApiError } from '@/lib/api';

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, [decisionId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await commentsApi.getByDecisionId(decisionId);
      
      if (response.error) {
        setError(handleApiError(response.error, 'Failed to load comments'));
      } else if (response.data) {
        setComments(response.data);
      }
    } catch (error) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
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
    setError(null);
    
    try {
      const mentions = extractMentions(newComment);
      const response = await commentsApi.create(decisionId, {
        content: newComment,
        parentId: replyTo || undefined,
        mentions,
      });

      if (response.error) {
        setError(handleApiError(response.error, 'Failed to post comment'));
      } else if (response.data) {
        setComments(prev => [response.data, ...prev]);
        setNewComment('');
        setReplyTo(null);
      }
    } catch (error) {
      setError('Failed to post comment');
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
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-white">
                  {comment.user.name || comment.user.email}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </div>
              {comment.mentions && comment.mentions.length > 0 && (
                <div className="mt-2 text-xs text-blue-400">
                  Mentioned: {comment.mentions.join(', ')}
                </div>
              )}
              <div className="mt-2">
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-xs text-gray-400 hover:text-gray-300 transition"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500 mx-auto mb-2"></div>
        <div className="text-gray-400 text-sm">Loading comments...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
          <div className="text-red-400 text-sm">{error}</div>
          <button
            onClick={fetchComments}
            className="text-red-300 hover:text-red-200 text-xs mt-1"
          >
            Try again
          </button>
        </div>
      )}

      {/* Comment Form */}
      {session?.user?.email && (
        <div className="mb-6">
          <form onSubmit={handleSubmitComment} className="space-y-3">
            {replyTo && (
              <div className="text-sm text-gray-400">
                Replying to comment...
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="ml-2 text-sky-400 hover:text-sky-300"
                >
                  Cancel
                </button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... Use @email@domain.com to mention someone"
              className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-400">
                Press Enter to submit, Shift+Enter for new line
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold text-sm transition"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map(renderComment)
        )}
      </div>
    </div>
  );
} 