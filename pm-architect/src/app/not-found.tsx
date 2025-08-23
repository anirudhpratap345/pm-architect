import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0E]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded font-semibold transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
