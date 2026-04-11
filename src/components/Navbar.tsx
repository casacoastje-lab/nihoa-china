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
import { motion } from 'motion/react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/map', label: 'Explore', zh: '探索', icon: Map },
    { to: '/blog', label: 'Blog', zh: '博客', icon: BookOpen },
    { to: '/learn', label: 'Learn', zh: '学习', icon: Gamepad2 },
    { to: '/gallery', label: 'Gallery', zh: '画廊', icon: ImageIcon },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-2">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-serif font-bold text-primary tracking-tight"
              >
                ChinaVerse <span className="text-foreground font-normal">中华宇宙</span>
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="group flex flex-col items-center transition-colors hover:text-primary text-foreground"
              >
                <span className="text-sm font-medium tracking-wide">{link.label} {link.zh}</span>
                <motion.div 
                  className="h-0.5 w-0 bg-primary mt-0.5"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0.5 border-2 border-primary/20 hover:border-primary transition-colors">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-muted text-primary font-serif">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-border bg-popover shadow-2xl">
                  <div className="px-4 py-3 border-b border-border mb-2">
                    <p className="font-serif font-bold text-lg leading-none">{profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{profile?.role}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-xl py-3 cursor-pointer">
                    <User className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">Dashboard 仪表板</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard?tab=settings')} className="rounded-xl py-3 cursor-pointer">
                    <Settings className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">Settings 设置</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-xl py-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Sign out 登出</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => navigate('/auth')} 
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-base font-serif italic"
              >
                Join the Scroll
              </Button>
            )}
            
            <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background border-b border-border py-8 px-6 space-y-6"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="flex items-center justify-between text-xl font-serif text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{link.label}</span>
              <span className="text-muted-foreground">{link.zh}</span>
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
