import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-serif font-bold text-primary tracking-tight mb-6 block">
              ChinaVerse <span className="text-foreground font-normal">中华宇宙</span>
            </Link>
            <p className="max-w-md text-muted-foreground leading-relaxed font-serif italic text-lg">
              Preserving the essence of the past while building the infrastructure for a cultural future.
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-serif font-bold text-xl mb-6">Resources 资源</h3>
            <ul className="space-y-4">
              <li><Link to="/map" className="text-muted-foreground hover:text-primary transition-colors">Cultural Heritage 遗产</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Bilibili 哔哩哔哩</Link></li>
              <li><Link to="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Photo Gallery 画廊</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-foreground font-serif font-bold text-xl mb-6">Company 公司</h3>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy 隐私</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact 联系</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-border/50 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ChinaVerse 中华宇宙. 京ICP备12345678号. The Living Scroll Experience.</p>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <motion.div whileHover={{ y: -2 }} className="cursor-pointer">🪭</motion.div>
            <motion.div whileHover={{ y: -2 }} className="cursor-pointer">🏮</motion.div>
            <motion.div whileHover={{ y: -2 }} className="cursor-pointer">🐼</motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
