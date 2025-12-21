'use client'

import { useState } from 'react';
import { Twitter, Linkedin, Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;              // Full URL to share (e.g., "https://pmarchitect.ai/c/abc123")
  text: string;             // Text to share (e.g., "Check out this comparison")
  comparisonId: string;     // Short ID for tracking
}

export default function ShareButtons({ url, text, comparisonId }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShareCount(prev => prev + 1);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
      // Track copy event (optional analytics)
      console.log('Link copied:', comparisonId);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      fallbackCopyToClipboard(url);
    }
  };

  const fallbackCopyToClipboard = (textToCopy: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
  };

  const handleTwitterShare = () => {
    // Twitter share URL format
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setShareCount(prev => prev + 1);
    
    // Track share event
    console.log('Shared to Twitter:', comparisonId);
  };

  const handleLinkedInShare = () => {
    // LinkedIn share URL format
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
    setShareCount(prev => prev + 1);
    
    // Track share event
    console.log('Shared to LinkedIn:', comparisonId);
  };

  return (
    <div className="my-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left side: Text */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Share this comparison
          </h3>
          <p className="text-xs text-gray-600">
            Help others save time on their tech decisions
          </p>
        </div>

        {/* Right side: Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Twitter Button */}
          <button
            onClick={handleTwitterShare}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            title="Share on Twitter/X"
          >
            <Twitter size={16} />
            <span className="hidden sm:inline">Twitter</span>
          </button>

          {/* LinkedIn Button */}
          <button
            onClick={handleLinkedInShare}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors text-sm font-medium"
            title="Share on LinkedIn"
          >
            <Linkedin size={16} />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
            title="Copy link to clipboard"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Link2 size={16} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share count (optional, hidden by default) */}
      {shareCount > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-gray-600">
          🎉 You've shared this {shareCount} {shareCount === 1 ? 'time' : 'times'}
        </div>
      )}
    </div>
  );
}

