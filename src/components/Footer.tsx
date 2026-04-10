import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white tracking-tighter mb-4 block">
              NIHAO<span className="text-red-600">COMMUNITY</span>
            </Link>
            <p className="max-w-xs">
              Connecting visitors to the rich culture, history, and beauty of China. Join our community to explore more.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/map" className="hover:text-white transition-colors">Map Navigator</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Travel Blog</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
              <li><Link to="/learn" className="hover:text-white transition-colors">Learn Chinese</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer Programs</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Join as Blogger</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-12 pt-8 text-sm text-center">
          © {new Date().getFullYear()} Nihao Community. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
