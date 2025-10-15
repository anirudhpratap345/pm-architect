export default function HomeFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-black border-t border-white/10 py-12 text-center text-gray-400">
      <h3 className="text-white text-2xl font-semibold mb-3">PMArchitect.ai</h3>
      <p className="text-gray-400 mb-4">AI-driven metric comparison for builders, developers, and analysts.</p>
      <p className="text-sm text-gray-500">© {year} PMArchitect.ai — All rights reserved.</p>
    </footer>
  )
}


