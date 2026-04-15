import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog';
import { Search, Image as ImageIcon, Info, Calendar, MapPin, X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';

const galleryItems = [
  {
    id: 1,
    title: 'Sunrise over the Great Wall',
    description: 'A breathtaking view of the Jinshanling section of the Great Wall at dawn.',
    info: 'The Great Wall of China is a series of fortifications that were built across the historical northern borders of ancient Chinese states and Imperial China as protection against various nomadic groups from the Eurasian Steppe.',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=1200',
    location: 'Beijing',
    date: 'Oct 2023',
    category: 'History'
  },
  {
    id: 2,
    title: 'Neon Nights in Shanghai',
    description: 'The futuristic skyline of Pudong reflected in the Huangpu River.',
    info: 'Shanghai is one of the world\'s largest seaport cities and a major financial center of the Asia-Pacific region. The Pudong district is famous for its distinctive skyline, including the Shanghai Tower and the Oriental Pearl Tower.',
    image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80&w=1200',
    location: 'Shanghai',
    date: 'Nov 2023',
    category: 'Modern'
  },
  {
    id: 3,
    title: 'Traditional Tea Ceremony',
    description: 'The delicate art of preparing and serving Chinese tea.',
    info: 'Chinese tea culture refers to how tea is prepared as well as the occasions when people consume tea in China. Tea culture in China differs from that in Europe, Britain or Japan in the preparation methods, tasting methods and the occasions for which it is consumed.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200',
    location: 'Hangzhou',
    date: 'Sep 2023',
    category: 'Culture'
  },
  {
    id: 4,
    title: 'Zhangjiajie Mountains',
    description: 'The inspiration for the floating mountains in the movie Avatar.',
    info: 'Zhangjiajie National Forest Park is a unique national forest park located in Zhangjiajie City in northern Hunan Province. It is one of several national parks within the Wulingyuan Scenic Area.',
    image: 'https://images.unsplash.com/photo-1599571234349-bb22800c582d?auto=format&fit=crop&q=80&w=1200',
    location: 'Hunan',
    date: 'Aug 2023',
    category: 'Nature'
  },
  {
    id: 5,
    title: 'Ancient Town of Fenghuang',
    description: 'A well-preserved ancient town with traditional stilt houses.',
    info: 'Fenghuang Ancient Town is situated on the western boundary of Hunan Province. It is a place where the ethnic minority of Miao and Tujia live. It was added to the UNESCO World Heritage Tentative List in 2008.',
    image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=1200',
    location: 'Hunan',
    date: 'July 2023',
    category: 'History'
  },
  {
    id: 6,
    title: 'Giant Panda Research Base',
    description: 'Getting up close with China\'s national treasure.',
    info: 'The Chengdu Research Base of Giant Panda Breeding is a non-profit research and breeding facility for giant pandas and other rare animals. It is located in Chengdu, Sichuan, China.',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08bef1ef1?auto=format&fit=crop&q=80&w=1200',
    location: 'Chengdu',
    date: 'June 2023',
    category: 'Nature'
  }
];

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(galleryItems.map(item => item.category))];

  const filteredItems = galleryItems.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20 gap-8 sm:gap-12"
      >
        <div className="space-y-4 sm:space-y-6 max-w-2xl">
          <div className="inline-flex items-center space-x-4 text-primary">
            <div className="h-px w-8 sm:w-12 bg-primary" />
            <span className="font-serif italic text-lg sm:text-xl font-bold uppercase tracking-widest">Visual Archive 视觉档案</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif font-bold tracking-tight leading-[0.85]">
            CURATED <br /> <span className="text-primary italic">MOMENTS</span>
          </h1>
          <p className="text-xl sm:text-2xl font-serif text-muted-foreground leading-relaxed italic">
            A photographic exploration of China's vast landscapes, ancient traditions, and futuristic urbanities.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search the archive..." 
              className="pl-12 h-14 rounded-full bg-card border-border font-serif italic text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-6 sm:pb-8 mb-8 sm:mb-12 no-scrollbar border-b border-border">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            className={`rounded-full px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-serif italic transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border-border hover:border-primary hover:text-primary'}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer"
            >
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-700 rounded-[2rem] sm:rounded-[3rem] bg-card relative aspect-[4/5]">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-6 sm:p-10">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    <Badge className="bg-primary text-white border-none font-serif italic px-3 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-sm">{item.category}</Badge>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-background leading-tight">{item.title}</h3>
                    <div className="flex items-center text-background/60 text-xs sm:text-sm font-serif italic">
                      <MapPin className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" /> {item.location}
                    </div>
                  </motion.div>
                </div>
                
                {/* Decorative Frame */}
                <div className="absolute inset-4 border border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 space-y-6"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-4">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-3xl font-serif font-bold italic">No records found</h3>
          <p className="text-xl font-serif italic text-muted-foreground">Try adjusting your search or category filters.</p>
        </motion.div>
      )}

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden rounded-[2rem] sm:rounded-[4rem] border-none bg-card shadow-2xl w-[95vw] sm:w-full">
          {selectedItem && (
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              <div className="lg:w-3/5 relative overflow-hidden aspect-video lg:aspect-auto">
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  src={selectedItem.image} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
              </div>
              <div className="lg:w-2/5 p-8 sm:p-12 lg:p-16 flex flex-col overflow-y-auto bg-card">
                <DialogHeader className="mb-8 sm:mb-10 space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-serif italic text-base sm:text-lg px-4 sm:px-6 py-1 sm:py-2 rounded-full">
                      {selectedItem.category}
                    </Badge>
                    <div className="flex items-center text-xs sm:text-sm font-serif italic text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" /> {selectedItem.date}
                    </div>
                  </div>
                  <DialogTitle className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-[0.9] mb-2 sm:mb-4">
                    {selectedItem.title}
                  </DialogTitle>
                  <div className="flex items-center text-primary text-lg sm:text-xl font-serif italic">
                    <MapPin className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" /> {selectedItem.location}
                  </div>
                  <DialogDescription className="text-xl sm:text-2xl font-serif italic text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 sm:pl-6 py-2">
                    "{selectedItem.description}"
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 sm:space-y-8 flex-grow">
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-serif font-bold text-lg sm:text-xl flex items-center uppercase tracking-widest text-foreground/60">
                      <Info className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-primary" /> Historical Context
                    </h4>
                    <p className="text-base sm:text-lg font-serif italic text-muted-foreground leading-relaxed">
                      {selectedItem.info}
                    </p>
                  </div>
                </div>

                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex gap-4 sm:gap-6">
                  <Button className="flex-grow bg-primary hover:bg-primary/90 text-white rounded-full h-14 sm:h-16 text-lg sm:text-xl font-serif italic shadow-xl shadow-primary/20">
                    Share Moment 分享
                  </Button>
                  <Button variant="outline" className="rounded-full h-14 w-14 sm:h-16 sm:w-16 p-0 border-border hover:border-primary hover:text-primary transition-all">
                    <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md z-50"
                onClick={() => setSelectedItem(null)}
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
