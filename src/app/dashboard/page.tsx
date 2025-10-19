// Dashboard - Placeholder for Lite version
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          This feature is disabled in the Lite version.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Visit <a href="/decisions" className="text-blue-600 hover:underline">/decisions</a> to view your comparison history, 
          or <a href="/analytics" className="text-blue-600 hover:underline">/analytics</a> for aggregate insights.
        </p>
        <a
          href="/compare"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Run a Comparison
        </a>
      </div>
    </div>
  );
}
