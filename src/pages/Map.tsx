import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { MapPin, Search, Navigation, Info, Layers, Filter, Globe, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { supabase } from '@/src/lib/supabase';
import { Landmark } from '@/src/types';
import { toast } from 'sonner';

const categories = ['All', 'History', 'Landmark', 'Nature', 'Art', 'Culture', 'Food', 'Architecture'];

const sampleLandmarks: Landmark[] = [
  {
    id: 'sample-1',
    name: 'The Forbidden City',
    name_zh: '故宫博物院',
    province: 'Beijing',
    description: 'The imperial palace of the Ming and Qing Dynasties, a masterpiece of Chinese architecture.',
    category: 'History',
    lat: 39.9163,
    lng: 116.3972,
    image_url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'sample-2',
    name: 'The Great Wall',
    name_zh: '万里长城',
    province: 'Beijing',
    description: 'A series of fortifications built across the historical northern borders of ancient Chinese states.',
    category: 'Landmark',
    lat: 40.4319,
    lng: 116.5704,
    image_url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'sample-3',
    name: 'West Lake',
    name_zh: '杭州西湖',
    province: 'Zhejiang',
    description: 'A freshwater lake in Hangzhou, famous for its scenic beauty and cultural significance.',
    category: 'Nature',
    lat: 30.2422,
    lng: 120.1492,
    image_url: 'https://images.unsplash.com/photo-1529921879218-f99546d03a9d?auto=format&fit=crop&q=80&w=1000'
  }
];

export default function MapPage() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const { data, error } = await supabase
          .from('landmarks')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        setLandmarks(data && data.length > 0 ? data : sampleLandmarks);
      } catch (err: any) {
        console.error('Error fetching landmarks:', err);
        setLandmarks(sampleLandmarks);
        toast.error('Using sample data: Database connection failed');
      }
    };

    fetchLandmarks();
  }, []);

  const handleMouseEnter = (landmark: Landmark) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setSelectedLandmark(landmark);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setSelectedLandmark(null);
    }, 300);
  };

  const handlePopupMouseEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  useEffect(() => {
    // Amap Security Config
    (window as any)._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECRET || '850a1836abcd4a800204300fbdb2f417',
    };

    AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY || '6bdf31318eda98960bd2d707da16fcd3',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.MouseTool'],
    }).then((AMap) => {
      if (!containerRef.current) return;

      if (mapRef.current) {
        mapRef.current.destroy();
      }

      const map = new AMap.Map(containerRef.current, {
        viewMode: '3D',
        zoom: 5,
        center: [116.397428, 39.90923], // Beijing center
        theme: 'amap://styles/light',
      });

      map.addControl(new AMap.Scale());
      map.addControl(new AMap.ToolBar());
      map.addControl(new AMap.ControlBar({
        position: { top: '10px', right: '10px' }
      }));

      mapRef.current = map;
      setMapLoaded(true);

      map.on('click', () => {
        setSelectedLandmark(null);
      });

      // Add markers if landmarks exist
      if (landmarks.length > 0) {
        // Clear old markers
        markersRef.current.forEach(m => m.marker.setMap(null));
        markersRef.current = [];

        landmarks.forEach(landmark => {
          const marker = new AMap.Marker({
            position: [landmark.lng, landmark.lat],
            title: landmark.name,
            map: map,
          });

          marker.on('click', () => {
            setSelectedLandmark(landmark);
          });

          marker.on('mouseover', () => {
            handleMouseEnter(landmark);
          });

          marker.on('mouseout', () => {
            handleMouseLeave();
          });

          markersRef.current.push({ id: landmark.id, marker });
        });
      }
    }).catch(e => {
      console.error('AMap Loader Error:', e);
    });

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [landmarks]);

  useEffect(() => {
    if (mapRef.current && selectedLandmark) {
      mapRef.current.setZoomAndCenter(12, [selectedLandmark.lng, selectedLandmark.lat], false, 500);
    }
  }, [selectedLandmark]);

  const filteredLandmarks = landmarks.filter(l => 
    (activeCategory === 'All' || l.category === activeCategory) &&
    (l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     l.name_zh?.includes(searchQuery) ||
     l.province?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenInAmap = () => {
    if (selectedLandmark) {
      const url = `https://uri.amap.com/marker?position=${selectedLandmark.lng},${selectedLandmark.lat}&name=${encodeURIComponent(selectedLandmark.name)}&coordinate=gaode&callnative=1`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-[380px] bg-card border-r border-border flex flex-col z-10 shadow-2xl"
      >
        <div className="p-3 space-y-3 border-b border-border">
          <div className="space-y-0.5">
            <div className="inline-flex items-center space-x-2 text-primary">
              <div className="h-px w-3 bg-primary" />
              <span className="font-serif italic text-[10px] font-bold uppercase tracking-widest">Cartography 绘图</span>
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight leading-[0.9]">
              MAP <span className="text-primary italic">NAVIGATOR</span>
            </h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input 
              placeholder="Search landmarks..." 
              className="pl-7 h-7 rounded-full bg-muted border-none font-serif italic text-[10px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className={`rounded-full px-2 py-0.5 text-[9px] font-serif italic transition-all h-5 ${activeCategory === cat ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border-border hover:border-primary hover:text-primary'}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-grow min-h-0">
          <div className="p-4 space-y-4">
            {filteredLandmarks.length > 0 ? filteredLandmarks.map((l, idx) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 5 }}
                onMouseEnter={() => handleMouseEnter(l)}
                onMouseLeave={handleMouseLeave}
                className={`p-3 rounded-[1.5rem] cursor-pointer transition-all border-2 ${selectedLandmark?.id === l.id ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-card border-border hover:border-primary/30'}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-14 h-14 rounded-[1rem] overflow-hidden shrink-0 shadow-md">
                    <img src={l.image_url} alt={l.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-sm leading-tight">{l.name}</h3>
                      <span className="text-[9px] font-serif italic text-muted-foreground">{l.province}</span>
                    </div>
                    <p className="text-[10px] text-primary font-serif font-bold italic">{l.name_zh}</p>
                    <p className="text-[10px] text-muted-foreground font-serif italic line-clamp-1 leading-relaxed">{l.description}</p>
                    <Badge variant="outline" className="text-[7px] mt-0.5 uppercase tracking-[0.1em] font-bold border-primary/20 text-primary h-3.5">
                      {l.category}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="py-10 text-center space-y-4">
                <MapPin className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm font-serif italic text-muted-foreground">No landmarks found in this region.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-muted/30">
          <Button 
            className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-10 text-base font-serif italic shadow-md"
            onClick={handleOpenInAmap}
          >
            <Navigation className="mr-2 h-4 w-4 text-primary" /> Open in Amap 开启导航
          </Button>
        </div>
      </motion.div>

      {/* Map Content */}
      <div className="flex-grow relative bg-muted">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/80 backdrop-blur-md">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-2xl font-serif italic text-muted-foreground">Loading Interactive Map... 载入地图</p>
            </div>
          </div>
        )}

        {/* Selected Landmark Overlay */}
        <AnimatePresence>
          {selectedLandmark && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              key={selectedLandmark.id}
              onMouseEnter={handlePopupMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="absolute bottom-12 left-12 right-12 md:right-auto md:w-[450px] z-10"
            >
              <Card className="rounded-[3.5rem] overflow-hidden shadow-2xl border-none bg-card">
                <div className="relative h-64 overflow-hidden group">
                  <img src={selectedLandmark.image_url} alt={selectedLandmark.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <Button size="icon" variant="secondary" className="absolute top-6 right-6 rounded-full bg-background/80 backdrop-blur-md hover:bg-background">
                    <Info size={20} className="text-primary" />
                  </Button>
                  <div className="absolute bottom-6 left-8">
                    <Badge className="bg-primary text-white border-none font-serif italic px-4 py-1">{selectedLandmark.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-4xl font-serif font-bold tracking-tight">{selectedLandmark.name}</h3>
                      <span className="text-sm font-serif italic text-muted-foreground flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-primary" /> {selectedLandmark.province}
                      </span>
                    </div>
                    <p className="text-2xl text-primary font-serif font-bold italic">{selectedLandmark.name_zh}</p>
                  </div>
                  <p className="text-lg text-muted-foreground font-serif italic leading-relaxed">
                    {selectedLandmark.description}
                  </p>
                  <div className="flex gap-4 pt-4">
                    <Button 
                      className="flex-grow bg-foreground text-background hover:bg-foreground/90 rounded-full h-16 text-xl font-serif italic shadow-xl"
                      onClick={handleOpenInAmap}
                    >
                      Get Directions 路线
                    </Button>
                    <Button variant="outline" className="rounded-full h-16 w-16 p-0 border-border hover:border-primary hover:text-primary transition-all">
                      <Star className="h-6 w-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
