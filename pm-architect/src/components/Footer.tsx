"use client";

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
  );
}
function TwitterIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 00-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 007.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 002.457-2.548z"/></svg>
  ); 
} 

export default function Footer() {
  return (
    <footer className="bg-black text-gray-500 py-10 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        {/* Logo and nav */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="font-extrabold text-xl tracking-tight text-white">PM</span>
          <span className="hidden sm:inline text-gray-300 font-semibold text-lg">Architect.ai</span>
          <nav className="flex gap-4 ml-0 md:ml-6">
            <a href="#product" className="hover:text-white transition">Product</a>
            <a href="#use-cases" className="hover:text-white transition">Use Cases</a>
            <a href="#blog" className="hover:text-white transition">Blog</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </nav>
        </div>
        {/* Social icons */}
        <div className="flex gap-4">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><LinkedInIcon /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><TwitterIcon /></a>
        </div>
      </div>
      <div className="text-center text-gray-600 mt-6 text-sm">
        © 2025 PMArchitect.ai – Built with <span className="text-red-500">❤️</span> for everyone building with technology
      </div>
    </footer>
  );
} 