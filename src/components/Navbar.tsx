import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { cn } from '@/src/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Map, BookOpen, Image as ImageIcon, Gamepad2, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMapPage = location.pathname === '/map';

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
    <nav className={cn(
      "absolute top-0 left-0 right-0 z-50 transition-all duration-500",
      isMapPage ? "mt-4 flex justify-center pointer-events-none" : "bg-transparent"
    )}>
      <div className={cn(
        "transition-all duration-500 pointer-events-auto",
        isMapPage 
          ? "bg-card/90 backdrop-blur-md border border-border rounded-full px-6 shadow-2xl mx-4 max-w-fit" 
          : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      )}>
        <div className={cn(
          "flex justify-between items-center transition-all duration-500",
          isMapPage ? "h-14 space-x-8" : "h-20"
        )}>
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-2">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "font-serif font-bold text-primary tracking-tight transition-all",
                  isMapPage ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
                )}
              >
                ChinaVerse {!isMapPage && <span className="hidden xs:inline text-foreground font-normal">中华宇宙</span>}
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={cn(
            "hidden md:flex items-center transition-all",
            isMapPage ? "space-x-6" : "space-x-10"
          )}>
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="group flex flex-col items-center transition-colors hover:text-primary text-foreground"
              >
                <span className={cn(
                  "font-medium tracking-wide transition-all",
                  isMapPage ? "text-xs" : "text-sm"
                )}>
                  {link.label} {isMapPage ? "" : link.zh}
                </span>
                <motion.div 
                  className="h-0.5 w-0 bg-primary mt-0.5"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>

          <div className={cn(
            "flex items-center transition-all",
            isMapPage ? "space-x-4" : "space-x-6"
          )}>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className={cn(
                    "relative rounded-full p-0.5 border-2 border-primary/20 hover:border-primary transition-all",
                    isMapPage ? "h-8 w-8" : "h-12 w-12"
                  )}>
                    <Avatar className="h-full w-full">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-muted text-primary font-serif text-[10px]">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
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
                className={cn(
                  "bg-primary hover:bg-primary/90 text-white rounded-full font-serif italic transition-all shrink-0 flex items-center justify-center",
                  isMapPage 
                    ? "px-3 py-1.5 text-xs h-7 sm:px-6 sm:h-9 sm:text-sm" 
                    : "px-4 h-9 text-sm sm:px-8 sm:h-11 sm:text-base md:px-12 md:h-12 md:text-lg"
                )}
              >
                <span className="hidden sm:inline">Join our community</span>
                <span className="sm:hidden">Join</span>
              </Button>
            )}
            
            <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={isMapPage ? 20 : 28} /> : <Menu size={isMapPage ? 20 : 28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden"
          >
            <div className="py-8 px-6 space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className="flex items-center justify-between text-xl font-serif text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-4">
                    <link.icon className="h-5 w-5 text-primary" />
                    <span>{link.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground uppercase tracking-widest">{link.zh}</span>
                </Link>
              ))}
              {!user && (
                <Button 
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }} 
                  className="w-full bg-primary text-white rounded-full py-6 text-lg font-serif italic"
                >
                  Join our community
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
