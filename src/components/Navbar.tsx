import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button, buttonVariants } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Map, BookOpen, Image as ImageIcon, Gamepad2, User, LogOut, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-red-600 tracking-tighter">
              NIHAO<span className="text-stone-900">COMMUNITY</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/map" className="flex items-center space-x-1 text-stone-600 hover:text-red-600 transition-colors">
              <Map size={18} />
              <span>Map</span>
            </Link>
            <Link to="/blog" className="flex items-center space-x-1 text-stone-600 hover:text-red-600 transition-colors">
              <BookOpen size={18} />
              <span>Blog</span>
            </Link>
            <Link to="/gallery" className="flex items-center space-x-1 text-stone-600 hover:text-red-600 transition-colors">
              <ImageIcon size={18} />
              <span>Gallery</span>
            </Link>
            <Link to="/learn" className="flex items-center space-x-1 text-stone-600 hover:text-red-600 transition-colors">
              <Gamepad2 size={18} />
              <span>Learn</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard?tab=settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/auth')} className="bg-red-600 hover:bg-red-700 text-white">
                Join Us
              </Button>
            )}
            
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 py-4 px-4 space-y-4">
          <Link to="/map" className="block text-stone-600" onClick={() => setIsMenuOpen(false)}>Map</Link>
          <Link to="/blog" className="block text-stone-600" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          <Link to="/gallery" className="block text-stone-600" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
          <Link to="/learn" className="block text-stone-600" onClick={() => setIsMenuOpen(false)}>Learn</Link>
        </div>
      )}
    </nav>
  );
}
