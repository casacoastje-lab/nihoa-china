import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog';
import { Search, Image as ImageIcon, Info, Calendar, MapPin, X, Download } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

const sampleCards = [
  {
    id: 'master-1',
    title: 'The Forbidden City',
    description: 'The geometric and architectural center of ancient Beijing.',
    info: 'As the world\'s largest surviving wooden palace complex, it encapsulates traditional Chinese palatial architecture. It relies heavily on timber framing, yellow glazed roof tiles, and complex Dougong brackets to support expansive eaves without nails.',
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/forbibden%20city.webp',
    location: 'Beijing',
    date: '1420',
    category: 'Ancient Structure'
  },
  {
    id: 'master-2',
    title: 'Temple of Heaven',
    description: 'An imperial complex of religious buildings visited by Emperors for annual prayer.',
    info: 'Built in the same era as the Forbidden City, the Temple of Heaven is a masterpiece of Ming architecture. Its primary structure, the Hall of Prayer for Good Harvests, is a completely wooden building constructed without a single nail, supported by 28 massive pillars.',
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Temple%20of%20Heaven.webp',
    location: 'Beijing',
    date: '1420',
    category: 'Ancient Structure'
  },
  {
    id: 'master-3',
    title: 'Potala Palace',
    description: 'A massive fortress-like complex in Lhasa, a masterpiece of Tibetan architecture.',
    info: 'The Potala Palace stands on the Red Mountain in the center of the Lhasa Valley. Built at an altitude of 3,700 meters, its thick walls are made of stone and rammed earth, painted with white and red to signify different religious and administrative functions.',
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Potala%20Palace.jpg',
    location: 'Lhasa, Tibet',
    date: '1645',
    category: 'Ancient Structure'
  },
  {
    id: 'master-4',
    title: 'Lijiang Old Town',
    description: 'A UNESCO World Heritage site known for its unique blend of indigenous architectural traditions.',
    info: 'Lijiang is famous for its sophisticated water-supply system of channels and bridges. The houses are typically timber-framed with mud-brick walls and tiled roofs, reflecting a unique synthesis of Han, Tibetan, and Bai building styles.',
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Lijiang%20Old%20Town.jpg',
    location: 'Lijiang, Yunnan',
    date: '11th Century',
    category: 'Ancient Structure'
  },
  {
    id: 'master-5',
    title: 'Terracotta Army',
    description: 'A collection of terracotta sculptures depicting the armies of the first Emperor of China.',
    info: 'Discovered in 1974, this vast subterranean necropolis contains thousands of individual life-sized figures. Each soldier has distinct facial features, and the arrangement reflects the precise military formation of the Qin Dynasty.',
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Terracotta%20Army.jpg',
    location: 'Xi\'an, Shaanxi',
    date: '210 BC',
    category: 'Ancient Structure'
  },
  {
    id: 'master-6',
    title: 'The Bund',
    description: 'A famous waterfront area in Shanghai, featuring iconic historical buildings.',
    info: 'The Bund is a living museum of colonial-era architecture, featuring Neoclassical, Renaissance, Art Deco, and Modernist styles. It represents the meeting point of East and West during Shanghai\'s rise as a global financial hub.',
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/The%20Bund.jpg',
    location: 'Shanghai',
    date: '19th-20th Century',
    category: 'Modern Wunder'
  },
  {
    id: 'master-7',
    title: 'Canton Tower',
    description: 'A multipurpose observation tower in Guangzhou, known for its distinct hyper-curved design.',
    info: 'The Canton Tower, also known as Guangzhou TV & Sightseeing Tower, is a staggering feat of structural engineering. Its unique "waist" is achieved through a patented design of inclined columns and rings, making it one of the most recognizable structures in China.',
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/canton%20tower.jpg',
    location: 'Guangzhou, Guangdong',
    date: '2010',
    category: 'Modern Wunder'
  },
  {
    id: 'master-8',
    title: 'Mogao Caves',
    description: 'A UNESCO World Heritage site known as the "Caves of the Thousand Buddhas".',
    info: 'Spanning 1,000 years of Buddhist art, the Mogao Caves are located at a strategic point along the Silk Road. They contain some of the finest examples of Buddhist frescoes and sculptures, housed in almost 500 individual grottoes carved into the cliff face.',
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/China_Magao-scaled.jpg',
    location: 'Dunhuang, Gansu',
    date: '4th-14th Century',
    category: 'Ancient Structure'
  },
  {
    id: 'master-9',
    title: 'Chongqing Art Museum',
    description: 'A striking modern architectural landmark in the heart of Chongqing.',
    info: 'Known for its distinctive red "chopstick" or lattice design, the Chongqing Art Museum is a masterpiece of modern architecture. The building uses a complex structural grid of vertical and horizontal red poles to create a weaving effect that symbolizes the spirit of the mountain city.',
    image: 'https://sefqcqhksupblrprcuzi.supabase.co/storage/v1/object/public/3dfile/Chongqing_Art_Museum.jpg',
    location: 'Chongqing',
    date: '2013',
    category: 'Modern Wunder'
  }
];

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('landmarks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        // Map DB landmarks to Gallery format
        const dbItems = (data || []).map(l => ({
          id: l.id,
          title: l.name,
          description: l.description,
          info: l.description + ' ' + (l.name_zh || ''),
          image: l.image_url,
          location: l.province,
          date: 'Recorded History',
          category: l.category || 'Archive'
        }));

        // Merge with master samples, avoiding exact title duplicates
        const merged = [...sampleCards];
        dbItems.forEach(dbI => {
          if (!merged.find(s => s.title.toLowerCase().trim() === dbI.title.toLowerCase().trim())) {
            merged.push(dbI);
          } else {
            // Update the master image with DB one if it exists
            const idx = merged.findIndex(s => s.title.toLowerCase().trim() === dbI.title.toLowerCase().trim());
            if (idx !== -1) merged[idx] = { ...merged[idx], image: dbI.image, id: dbI.id };
          }
        });

        setItems(merged);
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setItems(sampleCards);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const categories = ['All', ...new Set(items.map(item => item.category))];

  const filteredItems = items.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading:', error);
      window.open(url, '_blank');
    }
  };

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
        <DialogContent showCloseButton={false} className="max-w-[1200px] p-0 overflow-hidden rounded-[2rem] sm:rounded-[4rem] border-none bg-card shadow-2xl w-[95vw] lg:w-[90vw]">
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

                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-14 sm:h-16 text-lg sm:text-xl font-serif italic shadow-xl shadow-primary/20 gap-3"
                    onClick={() => handleDownload(selectedItem.image, selectedItem.title)}
                  >
                    <Download className="h-5 w-5 sm:h-6 sm:w-6" /> Download Picture 下载图片
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
