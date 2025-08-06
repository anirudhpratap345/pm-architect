"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: false,
      });
      
      console.log(`${provider} sign in result:`, result);
      
      if (result?.error) {
        setError(`${provider} sign in failed: ${result.error}`);
      } else if (result?.ok) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setError(`${provider} sign in failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (res?.error) {
        setError("Invalid email or password");
      } else if (res?.ok) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Credentials sign in error:", error);
      setError("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0E] px-4">
      <div className="w-full max-w-md bg-[#18181b] rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign in to PMArchitect.ai</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-lg py-2 font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.2 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.02l7.18 5.59C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.93.94 7.65 2.69 10.89l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.13 0 11.28-2.03 15.04-5.52l-7.18-5.59c-2 1.34-4.56 2.13-7.86 2.13-6.38 0-11.8-3.63-13.33-8.62l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>
          <button
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white rounded-lg py-2 font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/></svg>
            {isLoading ? "Signing in..." : "Sign in with GitHub"}
          </button>
          <button
            onClick={() => handleOAuthSignIn("slack")}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#4A154B] text-white rounded-lg py-2 font-semibold hover:bg-[#3a113b] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 122.8 122.8"><g><path fill="#ECB22E" d="M30.3 76.7c0 6.1-5 11.1-11.1 11.1S8 82.8 8 76.7s5-11.1 11.1-11.1h11.1v11.1zm5.6 0c0-6.1 5-11.1 11.1-11.1s11.1 5 11.1 11.1v27.8c0 6.1-5 11.1-11.1 11.1s-11.1-5-11.1-11.1V76.7z"/><path fill="#E01E5A" d="M46.9 30.3c-6.1 0-11.1-5-11.1-11.1S40.8 8 46.9 8s11.1 5 11.1 11.1v11.1H46.9zm0 5.6c6.1 0 11.1 5 11.1 11.1s-5 11.1-11.1 11.1H19.1c-6.1 0-11.1-5-11.1-11.1s5-11.1 11.1-11.1h27.8z"/><path fill="#36C5F0" d="M92.5 46.1c0-6.1 5-11.1 11.1-11.1s11.1 5 11.1 11.1-5 11.1-11.1 11.1H92.5V46.1zm-5.6 0c0 6.1-5 11.1-11.1 11.1s-11.1-5-11.1-11.1V18.3c0-6.1 5-11.1 11.1-11.1s11.1 5 11.1 11.1v27.8z"/><path fill="#2EB67D" d="M76.7 92.5c6.1 0 11.1 5 11.1 11.1s-5 11.1-11.1 11.1-11.1-5-11.1-11.1V92.5h11.1zm0-5.6c-6.1 0-11.1-5-11.1-11.1s5-11.1 11.1-11.1h27.8c6.1 0 11.1 5 11.1 11.1s-5 11.1-11.1 11.1H76.7z"/></g></svg>
            {isLoading ? "Signing in..." : "Sign in with Slack"}
          </button>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#18181b] text-gray-400">Or continue with email</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded border border-gray-700 bg-[#222] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded border border-gray-700 bg-[#222] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg py-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Demo credentials: demo@pmarchitect.ai / demo123</p>
        </div>
      </div>
    </div>
  );
} 