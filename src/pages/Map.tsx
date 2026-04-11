import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { MapPin, Search, Navigation, Info, Layers, Filter, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { supabase } from '@/src/lib/supabase';
import { Landmark } from '@/src/types';
import { toast } from 'sonner';

const categories = ['All', 'History', 'Landmark', 'Nature', 'Art', 'Culture', 'Food', 'Architecture'];

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
        setLandmarks(data || []);
      } catch (err: any) {
        console.error('Error fetching landmarks:', err);
        toast.error('Failed to load landmarks from database');
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
    if (!landmarks.length) return;

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

      // Clear old markers
      markersRef.current.forEach(m => m.marker.setMap(null));
      markersRef.current = [];

      // Add markers
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
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white border-r border-stone-200 flex flex-col z-10">
        <div className="p-6 border-b border-stone-100">
          <h1 className="text-2xl font-bold tracking-tighter mb-4">MAP <span className="text-red-600">NAVIGATOR</span></h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
            <Input 
              placeholder="Search landmarks..." 
              className="pl-10 rounded-xl bg-stone-50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto mt-4 pb-2 custom-scrollbar">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className={`rounded-full text-[10px] h-7 px-3 uppercase tracking-widest font-bold ${activeCategory === cat ? 'bg-red-600 hover:bg-red-700' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-grow min-h-0">
          <div className="p-4 space-y-3">
            {filteredLandmarks.map(l => (
              <motion.div
                key={l.id}
                whileHover={{ x: 4 }}
                onMouseEnter={() => handleMouseEnter(l)}
                onMouseLeave={handleMouseLeave}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedLandmark?.id === l.id ? 'bg-red-50 border-red-100' : 'bg-white border-stone-100 hover:bg-stone-50'}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={l.image_url} alt={l.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm">{l.name}</h3>
                      <span className="text-[10px] text-stone-400 font-medium">{l.province}</span>
                    </div>
                    <p className="text-[10px] text-red-600 font-bold mb-1">{l.name_zh}</p>
                    <p className="text-xs text-stone-500 line-clamp-1">{l.description}</p>
                    <Badge variant="outline" className="text-[9px] mt-2 uppercase tracking-widest">{l.category}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-stone-100 bg-stone-50">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 rounded-xl"
            onClick={handleOpenInAmap}
          >
            <Navigation className="mr-2 h-4 w-4" /> Open in Amap
          </Button>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-grow relative bg-stone-100">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-stone-100/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-stone-500 font-medium">Loading Interactive Map...</p>
            </div>
          </div>
        )}

        {/* Selected Landmark Overlay */}
        {selectedLandmark && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={selectedLandmark.id}
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute bottom-8 left-8 right-8 md:right-auto md:w-96 z-10"
          >
            <Card className="rounded-[2.5rem] overflow-hidden shadow-2xl border-none">
              <div className="relative h-48">
                <img src={selectedLandmark.image_url} alt={selectedLandmark.name} className="w-full h-full object-cover" />
                <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-sm">
                  <Info size={18} />
                </Button>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-red-600">{selectedLandmark.category}</Badge>
                  <span className="text-xs font-bold text-stone-400 flex items-center">
                    <Globe className="mr-1 h-3 w-3" /> {selectedLandmark.province}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{selectedLandmark.name}</h3>
                <p className="text-red-600 font-bold text-sm mb-3">{selectedLandmark.name_zh}</p>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  {selectedLandmark.description}
                </p>
                <div className="flex gap-3">
                  <Button 
                    className="flex-grow bg-stone-900 hover:bg-black rounded-full"
                    onClick={handleOpenInAmap}
                  >
                    Get Directions
                  </Button>
                  <Button variant="outline" className="rounded-full border-stone-200">Save</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
