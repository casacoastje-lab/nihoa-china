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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter mb-2">VISUAL <span className="text-red-600">JOURNEY</span></h1>
          <p className="text-stone-500">A curated collection of moments and landmarks across China.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
            <Input 
              placeholder="Search gallery..." 
              className="pl-10 rounded-full bg-white border-stone-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className={`rounded-full whitespace-nowrap ${activeCategory === cat ? 'bg-red-600 hover:bg-red-700' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer"
            >
              <Card className="overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <Badge className="w-fit mb-3 bg-red-600 border-none">{item.category}</Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-stone-300 text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-24">
          <ImageIcon className="mx-auto h-16 w-16 text-stone-200 mb-4" />
          <h3 className="text-xl font-bold">No images found</h3>
          <p className="text-stone-500">Try a different search or category.</p>
        </div>
      )}

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-[3rem] border-none bg-white">
          {selectedItem && (
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              <div className="lg:w-3/5 relative bg-stone-100">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="lg:w-2/5 p-10 flex flex-col overflow-y-auto">
                <DialogHeader className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none uppercase text-[10px] tracking-widest font-bold px-3">
                      {selectedItem.category}
                    </Badge>
                    <div className="flex items-center text-xs text-stone-400 font-medium">
                      <Calendar className="mr-1 h-3 w-3" /> {selectedItem.date}
                    </div>
                  </div>
                  <DialogTitle className="text-3xl font-bold tracking-tighter leading-tight mb-4">
                    {selectedItem.title}
                  </DialogTitle>
                  <div className="flex items-center text-stone-500 text-sm mb-6">
                    <MapPin className="mr-2 h-4 w-4 text-red-600" /> {selectedItem.location}
                  </div>
                  <DialogDescription className="text-stone-600 text-lg leading-relaxed italic">
                    "{selectedItem.description}"
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 flex-grow">
                  <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                    <h4 className="font-bold flex items-center mb-3">
                      <Info className="mr-2 h-4 w-4 text-red-600" /> Historical Context
                    </h4>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {selectedItem.info}
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-stone-100 flex gap-4">
                  <Button className="flex-grow bg-red-600 hover:bg-red-700 rounded-full h-12">
                    Share Moment
                  </Button>
                  <Button variant="outline" className="rounded-full h-12 border-stone-200">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
