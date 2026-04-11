import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/src/components/ui/button';
import { motion, useScroll, useTransform } from 'motion/react';
import { Map, BookOpen, Image as ImageIcon, Gamepad2, ArrowRight, Quote, Sparkles } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      title: 'Cultural Map',
      zh: '文化地图',
      desc: 'Navigate through 5,000 years of history with our interactive heritage navigator.',
      icon: Map,
      to: '/map',
      color: 'bg-red-500'
    },
    {
      title: 'Living Blog',
      zh: '生活博客',
      desc: 'Stories from the heart of the Middle Kingdom, curated by our global community.',
      icon: BookOpen,
      to: '/blog',
      color: 'bg-amber-500'
    },
    {
      title: 'Visual Archive',
      zh: '视觉档案',
      desc: 'A high-definition sanctuary for the colors and textures of Chinese life.',
      icon: ImageIcon,
      to: '/gallery',
      color: 'bg-emerald-500'
    },
    {
      title: 'Language Lab',
      zh: '语言实验室',
      desc: 'Master the art of Hanzi through our immersive, motion-driven learning experience.',
      icon: Gamepad2,
      to: '/learn',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=2000" 
            alt="Forbidden City" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div 
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-20 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-8 inline-block"
          >
            <span className="px-6 py-2 rounded-full border border-white/30 backdrop-blur-md text-white font-serif italic text-lg tracking-widest uppercase">
              The Living Scroll • 活着的长卷
            </span>
          </motion.div>
          
          <h1 className="text-7xl md:text-9xl font-serif font-bold text-white tracking-tighter leading-none mb-8">
            ChinaVerse <br />
            <span className="text-primary italic">中华宇宙</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-white/80 font-serif italic max-w-3xl mx-auto leading-relaxed mb-12">
            "A digital sanctuary for the timeless spirit of China. Preserving the past, architecting the future."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/learn" 
              className={buttonVariants({ 
                size: "lg", 
                className: "bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-8 text-xl font-serif italic shadow-2xl shadow-primary/40 group" 
              })}
            >
              Begin the Journey 开启旅程
              <motion.span 
                animate={{ x: [0, 5, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="ml-3"
              >
                <ArrowRight />
              </motion.span>
            </Link>
            <Link 
              to="/map" 
              className={buttonVariants({ 
                variant: "outline",
                size: "lg", 
                className: "border-white/30 text-white hover:bg-white/10 backdrop-blur-md rounded-full px-12 py-8 text-xl font-serif italic" 
              })}
            >
              Explore Map 探索地图
            </Link>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] mb-4">Scroll to Unfold</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-4 text-primary">
                <div className="h-px w-12 bg-primary" />
                <span className="font-serif italic text-xl font-bold uppercase tracking-widest">Our Philosophy 我们的哲学</span>
              </div>
              <h2 className="text-6xl font-serif font-bold tracking-tight leading-tight">
                Infrastructure for <br />
                <span className="italic text-primary">Cultural Continuity</span>
              </h2>
              <p className="text-2xl font-serif text-muted-foreground leading-relaxed italic">
                We believe that culture is not a static artifact to be stored in a museum, but a living, breathing entity that evolves with every interaction.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="space-y-2">
                  <div className="text-4xl font-serif font-bold text-primary">5,000+</div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest">Years of History</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-serif font-bold text-primary">1.4B+</div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest">Global Voices</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1529921879218-f99546d03a9d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Calligraphy" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-card p-8 rounded-3xl shadow-xl max-w-xs border border-border">
                <Quote className="text-primary h-8 w-8 mb-4" />
                <p className="font-serif italic text-lg leading-relaxed">
                  "The brush mirrors the mind; the scroll mirrors the universe."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-serif font-bold tracking-tight">Curated Experiences 策展体验</h2>
            <p className="text-xl text-muted-foreground font-serif italic">Explore the many facets of the Middle Kingdom.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Link to={feature.to}>
                  <div className="h-full bg-card rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-primary/20 flex flex-col group">
                    <div className={`p-5 rounded-2xl ${feature.color} text-white w-fit mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-2">{feature.title}</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-[0.2em] mb-6">{feature.zh}</p>
                    <p className="text-muted-foreground font-serif italic leading-relaxed flex-grow">
                      {feature.desc}
                    </p>
                    <div className="mt-8 flex items-center text-primary font-serif font-bold italic group-hover:translate-x-2 transition-transform">
                      Enter Scroll <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="grid grid-cols-10 h-full">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-white/20 aspect-square" />
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-20 text-center text-white space-y-12">
          <Sparkles className="h-16 w-16 mx-auto text-white/50" />
          <h2 className="text-6xl md:text-8xl font-serif font-bold tracking-tight">
            Become a part of the <br />
            <span className="italic">Eternal Rhythm</span>
          </h2>
          <p className="text-2xl font-serif italic text-white/80 max-w-2xl mx-auto leading-relaxed">
            Join thousands of explorers, scholars, and creators in building the future of Chinese cultural heritage.
          </p>
          <div className="pt-8">
            <Link 
              to="/auth" 
              className={buttonVariants({ 
                size: "lg", 
                className: "bg-white text-primary hover:bg-white/90 rounded-full px-16 py-8 text-2xl font-serif italic shadow-2xl" 
              })}
            >
              Join the Community 加入社区
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
